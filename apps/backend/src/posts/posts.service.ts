import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, post_status } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreatePostDto, UpdatePostDto } from './posts.dto.js';

// Statuses a user may pick when creating or editing a post.
// 'deleted' is only ever set by remove().
const EDITABLE_STATUSES: post_status[] = [
  post_status.draft,
  post_status.published,
];


const postSelect = {
  post_id: true,
  header: true,
  body: true,
  status: true,
  created_at: true,
  updated_at: true,
  courses: { select: { course_id: true, code: true, name: true } },
  users: { select: { id: true, name: true, username: true, avatar_url: true } },
} satisfies Prisma.postsSelect;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  // READ (list): newest published posts first
  findAll() {
    return this.prisma.posts.findMany({
      where: { status: post_status.published },
      orderBy: { created_at: 'desc' },
      take: 50,
      select: postSelect,
    });
  }

  // READ (one): anyone can see a published post; only the author can see their draft
  async findOne(postId: string, userId?: string) {
    const post = await this.prisma.posts.findUnique({
      where: { post_id: postId },
      select: postSelect,
    });

    if (!post || post.status === post_status.deleted) {
      throw new NotFoundException('Post not found');
    }
    if (post.status !== post_status.published && post.users.id !== userId) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  // CREATE
  async create(userId: string, dto: CreatePostDto) {
    this.validate(dto);
    if (dto.header === undefined || dto.course_id === undefined) {
      throw new BadRequestException('header and course_id are required');
    }
    await this.ensureCourseExists(dto.course_id);

    return this.prisma.posts.create({
      data: {
        user_id: userId,
        course_id: dto.course_id,
        header: dto.header.trim(),
        body: dto.body,
        status: dto.status ?? post_status.draft,
      },
      select: postSelect,
    });
  }

  // UPDATE: fields left out of the body stay as they are
  async update(postId: string, userId: string, dto: UpdatePostDto) {
    this.validate(dto);
    await this.findOwnedPost(postId, userId);
    if (dto.course_id !== undefined) {
      await this.ensureCourseExists(dto.course_id);
    }

    return this.prisma.posts.update({
      where: { post_id: postId },
      data: {
        header: dto.header?.trim(),
        body: dto.body,
        course_id: dto.course_id,
        status: dto.status,
        // updated_at has no @updatedAt in the schema, so it must be set by hand
        updated_at: new Date(),
      },
      select: postSelect,
    });
  }

  // DELETE (soft): the row stays in the table, only its status changes
  async remove(postId: string, userId: string) {
    await this.findOwnedPost(postId, userId);

    await this.prisma.posts.update({
      where: { post_id: postId },
      data: { status: post_status.deleted, updated_at: new Date() },
    });
  }

  // Throws 404 if the post is missing or already deleted, 403 if it isn't the caller's
  private async findOwnedPost(postId: string, userId: string) {
    const post = await this.prisma.posts.findUnique({
      where: { post_id: postId },
      select: { user_id: true, status: true },
    });

    if (!post || post.status === post_status.deleted) {
      throw new NotFoundException('Post not found');
    }
    if (post.user_id !== userId) {
      throw new ForbiddenException('You can only change your own posts');
    }
  }

  private async ensureCourseExists(courseId: number) {
    const course = await this.prisma.courses.findUnique({
      where: { course_id: courseId },
      select: { course_id: true },
    });
    if (!course) {
      throw new BadRequestException(`Course ${courseId} does not exist`);
    }
  }

  // Checks every field that was sent; missing fields are fine here
  private validate(dto: UpdatePostDto) {
    if (!dto || typeof dto !== 'object') {
      throw new BadRequestException('Request body must be a JSON object');
    }
    if (
      dto.header !== undefined &&
      (typeof dto.header !== 'string' ||
        dto.header.trim().length === 0 ||
        dto.header.trim().length > 200)
    ) {
      throw new BadRequestException('header must be 1-200 characters');
    }
    if (dto.course_id !== undefined && !Number.isInteger(dto.course_id)) {
      throw new BadRequestException('course_id must be a whole number');
    }
    if (
      dto.body !== undefined &&
      dto.body !== null &&
      typeof dto.body !== 'string'
    ) {
      throw new BadRequestException('body must be text');
    }
    if (dto.status !== undefined && !EDITABLE_STATUSES.includes(dto.status)) {
      throw new BadRequestException(
        `status must be one of: ${EDITABLE_STATUSES.join(', ')}`,
      );
    }
  }
}