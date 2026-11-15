import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service.js';
import { PostsService } from './posts.service.js';

const AUTHOR = '11111111-1111-4111-8111-111111111111';
const STRANGER = '22222222-2222-4222-8222-222222222222';
const POST_ID = '33333333-3333-4333-8333-333333333333';
const PNG = 'data:image/png;base64,iVBORw0KGgo=';

// A row shaped like what Prisma returns for the service's select
function postRow(overrides: Record<string, unknown> = {}) {
  return {
    post_id: POST_ID,
    header: 'Midterms Reviewer',
    body: '<p>Notes</p>',
    status: 'published',
    created_at: new Date('2026-11-01T00:00:00Z'),
    updated_at: new Date('2026-11-01T00:00:00Z'),
    courses: { course_id: 1, code: 'STSWENG', name: 'Software Engineering' },
    users: { id: AUTHOR, name: 'Alex', username: 'alex', avatar_url: null },
    post_files: [{ file_id: 'f1', file_url: PNG, file_type: 'image/png' }],
    _count: { comments: 2, post_votes: 5 },
    ...overrides,
  };
}

// What findOwnedPost() loads before an update or delete
function ownedRow(overrides: Record<string, unknown> = {}) {
  return {
    user_id: AUTHOR,
    status: 'published',
    header: 'Midterms Reviewer',
    course_id: 1,
    ...overrides,
  };
}

function createPrismaMock() {
  const prisma = {
    posts: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      create: vi.fn().mockResolvedValue(postRow()),
      update: vi.fn().mockResolvedValue(postRow()),
    },
    post_files: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
      count: vi.fn().mockResolvedValue(0),
    },
    courses: {
      findUnique: vi.fn().mockResolvedValue({ is_verified: true }),
    },
    $transaction: vi.fn(),
  };

  // Run the transaction callback against the same mock
  prisma.$transaction.mockImplementation(
    (callback: (tx: typeof prisma) => unknown) => callback(prisma),
  );

  return prisma;
}

describe('PostsService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: PostsService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new PostsService(prisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('only lists published posts, newest first', async () => {
      prisma.posts.findMany.mockResolvedValue([postRow()]);

      const result = await service.findAll();

      const args = prisma.posts.findMany.mock.calls[0][0];
      expect(args.where).toEqual({ status: 'published' });
      expect(args.orderBy).toEqual({ created_at: 'desc' });
      expect(result).toHaveLength(1);
    });

    it('renames relations and exposes like and comment counts', async () => {
      prisma.posts.findMany.mockResolvedValue([postRow()]);

      const [post] = await service.findAll();

      expect(post).toMatchObject({
        post_id: POST_ID,
        header: 'Midterms Reviewer',
        course: { code: 'STSWENG' },
        author: { id: AUTHOR, username: 'alex' },
        files: [{ file_id: 'f1', file_type: 'image/png' }],
        likes: 5,
        comments: 2,
      });
      expect(post).not.toHaveProperty('users');
      expect(post).not.toHaveProperty('_count');
    });

    it('filters by course code without regard to letter case', async () => {
      await service.findAll({ course: 'stsweng' });

      expect(prisma.posts.findMany.mock.calls[0][0].where).toEqual({
        status: 'published',
        courses: { code: { equals: 'stsweng', mode: 'insensitive' } },
      });
    });
  });

  describe('findMine', () => {
    it("lists the user's own posts except deleted ones", async () => {
      await service.findMine(AUTHOR);

      expect(prisma.posts.findMany.mock.calls[0][0].where).toEqual({
        user_id: AUTHOR,
        status: { not: 'deleted' },
      });
    });

    it('lists only drafts when asked for drafts', async () => {
      await service.findMine(AUTHOR, { status: 'draft' });

      expect(prisma.posts.findMany.mock.calls[0][0].where).toEqual({
        user_id: AUTHOR,
        status: 'draft',
      });
    });
  });

  describe('findOne', () => {
    it('returns a published post to anyone, logged in or not', async () => {
      prisma.posts.findUnique.mockResolvedValue(postRow());

      await expect(service.findOne(POST_ID)).resolves.toMatchObject({
        post_id: POST_ID,
      });
      await expect(service.findOne(POST_ID, STRANGER)).resolves.toMatchObject({
        post_id: POST_ID,
      });
    });

    it('returns a draft to its author', async () => {
      prisma.posts.findUnique.mockResolvedValue(postRow({ status: 'draft' }));

      await expect(service.findOne(POST_ID, AUTHOR)).resolves.toMatchObject({
        status: 'draft',
      });
    });

    it('hides a draft from other users and from anonymous visitors', async () => {
      prisma.posts.findUnique.mockResolvedValue(postRow({ status: 'draft' }));

      await expect(service.findOne(POST_ID, STRANGER)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(POST_ID)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('treats deleted and missing posts as not found, even for the author', async () => {
      prisma.posts.findUnique.mockResolvedValue(postRow({ status: 'deleted' }));
      await expect(service.findOne(POST_ID, AUTHOR)).rejects.toThrow(
        NotFoundException,
      );

      prisma.posts.findUnique.mockResolvedValue(null);
      await expect(service.findOne(POST_ID, AUTHOR)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('saves a draft by default, owned by the logged-in user', async () => {
      await service.create(AUTHOR, { course_id: 1, header: 'WIP' });

      expect(prisma.posts.create.mock.calls[0][0].data).toMatchObject({
        user_id: AUTHOR,
        course_id: 1,
        header: 'WIP',
        status: 'draft',
      });
    });

    it('allows an untitled draft', async () => {
      await service.create(AUTHOR, { course_id: 1, status: 'draft' });

      expect(prisma.posts.create.mock.calls[0][0].data.header).toBe('');
    });

    it('publishes when status is published', async () => {
      await service.create(AUTHOR, {
        course_id: 1,
        header: 'Reviewer',
        status: 'published',
      });

      expect(prisma.posts.create.mock.calls[0][0].data.status).toBe(
        'published',
      );
    });

    it('refuses to publish without a title', async () => {
      await expect(
        service.create(AUTHOR, { course_id: 1, status: 'published' }),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.posts.create).not.toHaveBeenCalled();
    });

    it('rejects a course that is not verified', async () => {
      prisma.courses.findUnique.mockResolvedValue({ is_verified: false });

      await expect(
        service.create(AUTHOR, { course_id: 9, header: 'x' }),
      ).rejects.toThrow('Course 9 is not verified');
      expect(prisma.posts.create).not.toHaveBeenCalled();
    });

    it('rejects a course that does not exist', async () => {
      prisma.courses.findUnique.mockResolvedValue(null);

      await expect(
        service.create(AUTHOR, { course_id: 9, header: 'x' }),
      ).rejects.toThrow('Course 9 does not exist');
    });

    it('stores attached files in post_files with a file type', async () => {
      await service.create(AUTHOR, {
        course_id: 1,
        header: 'With files',
        files: [
          { file_url: PNG },
          { file_url: 'data:application/pdf;base64,JVBERi0=', file_type: 'pdf' },
          {
            file_url:
              'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,UEsDBA==',
          },
        ],
      });

      const files = prisma.posts.create.mock.calls[0][0].data.post_files.create;
      expect(files).toEqual([
        { file_url: PNG, file_type: 'image/png' },
        { file_url: 'data:application/pdf;base64,JVBERi0=', file_type: 'pdf' },
        expect.objectContaining({ file_type: 'pptx' }),
      ]);
    });
  });

  describe('update', () => {
    it('lets the author edit a post and stamps updated_at', async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow());

      await service.update(POST_ID, AUTHOR, { header: 'New title' });

      const args = prisma.posts.update.mock.calls[0][0];
      expect(args.where).toEqual({ post_id: POST_ID });
      expect(args.data.header).toBe('New title');
      expect(args.data.updated_at).toBeInstanceOf(Date);
      expect(args.data).not.toHaveProperty('created_at');
    });

    it("refuses to edit someone else's published post", async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow());

      await expect(
        service.update(POST_ID, STRANGER, { header: 'Hijacked' }),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.posts.update).not.toHaveBeenCalled();
    });

    it("does not reveal someone else's draft", async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow({ status: 'draft' }));

      await expect(
        service.update(POST_ID, STRANGER, { header: 'Hijacked' }),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.posts.update).not.toHaveBeenCalled();
    });

    it('publishes a draft and dates it from the moment of publishing', async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow({ status: 'draft' }));

      await service.update(POST_ID, AUTHOR, { status: 'published' });

      const { data } = prisma.posts.update.mock.calls[0][0];
      expect(data.status).toBe('published');
      expect(data.created_at).toBeInstanceOf(Date);
    });

    it('refuses to publish a draft that has no title', async () => {
      prisma.posts.findUnique.mockResolvedValue(
        ownedRow({ status: 'draft', header: '' }),
      );

      await expect(
        service.update(POST_ID, AUTHOR, { status: 'published' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('refuses to clear the title of a published post', async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow());

      await expect(
        service.update(POST_ID, AUTHOR, { header: '' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('does not let the author change the status of an archived post', async () => {
      prisma.posts.findUnique.mockResolvedValue(
        ownedRow({ status: 'archived' }),
      );

      await expect(
        service.update(POST_ID, AUTHOR, { status: 'published' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('checks the course only when it changes', async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow());

      await service.update(POST_ID, AUTHOR, { course_id: 1 });
      expect(prisma.courses.findUnique).not.toHaveBeenCalled();

      prisma.courses.findUnique.mockResolvedValue({ is_verified: false });
      await expect(
        service.update(POST_ID, AUTHOR, { course_id: 2 }),
      ).rejects.toThrow('Course 2 is not verified');
    });

    it('removes files only from the post being edited', async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow());

      await service.update(POST_ID, AUTHOR, { remove_file_ids: ['f1'] });

      expect(prisma.post_files.deleteMany).toHaveBeenCalledWith({
        where: { post_id: POST_ID, file_id: { in: ['f1'] } },
      });
    });

    it('adds new files and keeps the existing ones', async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow());
      prisma.post_files.count.mockResolvedValue(1);

      await service.update(POST_ID, AUTHOR, { add_files: [{ file_url: PNG }] });

      expect(prisma.post_files.deleteMany).not.toHaveBeenCalled();
      expect(prisma.post_files.createMany).toHaveBeenCalledWith({
        data: [{ post_id: POST_ID, file_url: PNG, file_type: 'image/png' }],
      });
    });

    it('refuses to go over the file limit', async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow());
      prisma.post_files.count.mockResolvedValue(10);

      await expect(
        service.update(POST_ID, AUTHOR, { add_files: [{ file_url: PNG }] }),
      ).rejects.toThrow('A post can have at most 10 files');
      expect(prisma.post_files.createMany).not.toHaveBeenCalled();
      expect(prisma.posts.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('soft-deletes the post for its author', async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow());

      await service.remove(POST_ID, AUTHOR);

      const args = prisma.posts.update.mock.calls[0][0];
      expect(args.where).toEqual({ post_id: POST_ID });
      expect(args.data.status).toBe('deleted');
    });

    it('lets the author delete a draft', async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow({ status: 'draft' }));

      await service.remove(POST_ID, AUTHOR);

      expect(prisma.posts.update.mock.calls[0][0].data.status).toBe('deleted');
    });

    it("refuses to delete someone else's post", async () => {
      prisma.posts.findUnique.mockResolvedValue(ownedRow());

      await expect(service.remove(POST_ID, STRANGER)).rejects.toThrow(
        ForbiddenException,
      );
      expect(prisma.posts.update).not.toHaveBeenCalled();
    });

    it('reports an already deleted post as not found', async () => {
      prisma.posts.findUnique.mockResolvedValue(
        ownedRow({ status: 'deleted' }),
      );

      await expect(service.remove(POST_ID, AUTHOR)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
