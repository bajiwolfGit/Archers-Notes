import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, post_status } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto, USER_STATUSES } from './dto/create-post.dto.js';
import {
  ListMyPostsQueryDto,
  ListPostsQueryDto,
} from './dto/list-posts-query.dto.js';
import { PostFileDto } from './dto/post-file.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { MAX_FILES_PER_POST } from './posts.constants.js';

// Most posts returned by one list request
const LIST_LIMIT = 50;

// Writing several multi-megabyte files can take longer than Prisma's default
// 5 second transaction timeout.
const FILE_TRANSACTION_TIMEOUT_MS = 30_000;

// MIME types that do not fit in post_files.file_type (VARCHAR(50))
const SHORT_FILE_TYPES: Record<string, string> = {
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'pptx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

// Everything the API returns about a post
const postSelect = {
  post_id: true,
  header: true,
  body: true,
  status: true,
  created_at: true,
  updated_at: true,
  courses: { select: { course_id: true, code: true, name: true } },
  users: { select: { id: true, name: true, username: true, avatar_url: true } },
  post_files: { select: { file_id: true, file_url: true, file_type: true } },
  _count: {
    select: {
      comments: true,
      post_votes: { where: { value: { gt: 0 } } },
    },
  },
} satisfies Prisma.postsSelect;

type PostRow = Prisma.postsGetPayload<{ select: typeof postSelect }>;

// Renames the Prisma relation fields to what they mean for a post
function toPostResponse(row: PostRow) {
  const { courses, users, post_files, _count, ...post } = row;

  return {
    ...post,
    course: courses,
    author: users,
    files: post_files,
    likes: _count.post_votes,
    comments: _count.comments,
  };
}

// The file_type to store: the one sent by the client, otherwise the MIME type
// written at the start of the data URL.
function resolveFileType(file: PostFileDto): string | null {
  if (file.file_type) return file.file_type;

  const mime = /^data:([^;,]+)/.exec(file.file_url)?.[1];
  if (!mime) return null;
  if (mime.length <= 50) return mime;

  return SHORT_FILE_TYPES[mime] ?? null;
}

function toFileRow(file: PostFileDto) {
  return { file_url: file.file_url, file_type: resolveFileType(file) };
}

function isUserStatus(status: post_status): boolean {
  return (USER_STATUSES as readonly string[]).includes(status);
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  // READ (feed): published posts only, newest first
  async findAll(query: ListPostsQueryDto = {}) {
    const rows = await this.prisma.posts.findMany({
      where: {
        status: post_status.published,
        ...(query.course && {
          courses: { code: { equals: query.course, mode: 'insensitive' } },
        }),
      },
      orderBy: { created_at: 'desc' },
      take: LIST_LIMIT,
      select: postSelect,
    });

    return rows.map(toPostResponse);
  }

  // READ (own posts): the logged-in user's posts, drafts included.
  // GET /posts/mine?status=draft is the drafts page.
  async findMine(userId: string, query: ListMyPostsQueryDto = {}) {
    const rows = await this.prisma.posts.findMany({
      where: {
        user_id: userId,
        status: query.status ?? { not: post_status.deleted },
      },
      orderBy: { updated_at: 'desc' },
      select: postSelect,
    });

    return rows.map(toPostResponse);
  }

  // READ (one): anyone can open a published post. Anything else (a draft,
  // for example) is only visible to the user who created it.
  async findOne(postId: string, userId?: string) {
    const row = await this.prisma.posts.findUnique({
      where: { post_id: postId },
      select: postSelect,
    });

    if (!row || row.status === post_status.deleted) {
      throw new NotFoundException('Post not found');
    }
    if (row.status !== post_status.published && row.users.id !== userId) {
      // Same answer as a missing post, so drafts cannot be discovered by id
      throw new NotFoundException('Post not found');
    }

    return toPostResponse(row);
  }

  // CREATE: the logged-in user becomes the post's author
  async create(userId: string, dto: CreatePostDto) {
    const status = dto.status ?? post_status.draft;
    const header = dto.header ?? '';

    this.ensurePublishable(status, header);
    await this.ensureVerifiedCourse(dto.course_id);

    const row = await this.prisma.posts.create({
      data: {
        user_id: userId,
        course_id: dto.course_id,
        header,
        body: dto.body,
        status,
        ...(dto.files?.length && {
          post_files: { create: dto.files.map(toFileRow) },
        }),
      },
      select: postSelect,
    });

    return toPostResponse(row);
  }

  // UPDATE: author only. Fields left out of the request stay as they are.
  async update(postId: string, userId: string, dto: UpdatePostDto) {
    const existing = await this.findOwnedPost(postId, userId);

    const statusChanges =
      dto.status !== undefined && dto.status !== existing.status;

    if (statusChanges && !isUserStatus(existing.status)) {
      throw new BadRequestException(
        `A post that is ${existing.status} cannot change status`,
      );
    }

    this.ensurePublishable(
      dto.status ?? existing.status,
      dto.header ?? existing.header,
    );

    if (dto.course_id !== undefined && dto.course_id !== existing.course_id) {
      await this.ensureVerifiedCourse(dto.course_id);
    }

    const now = new Date();
    const isBeingPublished =
      statusChanges && dto.status === post_status.published;
    const addFiles = dto.add_files ?? [];
    const removeFileIds = dto.remove_file_ids ?? [];

    return this.prisma.$transaction(
      async (tx) => {
        if (removeFileIds.length > 0) {
          // post_id in the filter keeps this from touching another post's files
          await tx.post_files.deleteMany({
            where: { post_id: postId, file_id: { in: removeFileIds } },
          });
        }

        if (addFiles.length > 0) {
          const kept = await tx.post_files.count({
            where: { post_id: postId },
          });

          if (kept + addFiles.length > MAX_FILES_PER_POST) {
            throw new BadRequestException(
              `A post can have at most ${MAX_FILES_PER_POST} files`,
            );
          }

          await tx.post_files.createMany({
            data: addFiles.map((file) => ({
              post_id: postId,
              ...toFileRow(file),
            })),
          });
        }

        const row = await tx.posts.update({
          where: { post_id: postId },
          data: {
            header: dto.header,
            body: dto.body,
            course_id: dto.course_id,
            status: dto.status,
            // updated_at has no @updatedAt in the schema, so it is set by hand
            updated_at: now,
            // A draft enters the feed at the moment it is published, not at
            // the moment the draft was first saved
            ...(isBeingPublished && { created_at: now }),
          },
          select: postSelect,
        });

        return toPostResponse(row);
      },
      { timeout: FILE_TRANSACTION_TIMEOUT_MS },
    );
  }

  // DELETE (soft): author only. The row stays, its status becomes "deleted"
  // and it stops appearing in every read above.
  async remove(postId: string, userId: string) {
    await this.findOwnedPost(postId, userId);

    await this.prisma.posts.update({
      where: { post_id: postId },
      data: { status: post_status.deleted, updated_at: new Date() },
    });
  }

  // Loads a post for editing or deleting and checks that the caller owns it.
  // 404 when the post is missing, deleted, or someone else's unpublished post;
  // 403 when it is someone else's published post.
  private async findOwnedPost(postId: string, userId: string) {
    const post = await this.prisma.posts.findUnique({
      where: { post_id: postId },
      select: { user_id: true, status: true, header: true, course_id: true },
    });

    if (!post || post.status === post_status.deleted) {
      throw new NotFoundException('Post not found');
    }

    if (post.user_id !== userId) {
      if (post.status === post_status.published) {
        throw new ForbiddenException('You can only change your own posts');
      }
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  // A draft may be untitled; a published post may not
  private ensurePublishable(status: post_status, header: string) {
    if (status === post_status.published && header === '') {
      throw new BadRequestException('header is required to publish a post');
    }
  }

  // Posts can only be filed under courses that exist and are verified
  private async ensureVerifiedCourse(courseId: number) {
    const course = await this.prisma.courses.findUnique({
      where: { course_id: courseId },
      select: { is_verified: true },
    });

    if (!course) {
      throw new BadRequestException(`Course ${courseId} does not exist`);
    }
    if (!course.is_verified) {
      throw new BadRequestException(`Course ${courseId} is not verified`);
    }
  }
}
