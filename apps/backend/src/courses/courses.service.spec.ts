import type { PrismaService } from '../prisma/prisma.service.js';
import { CoursesService } from './courses.service.js';

describe('CoursesService', () => {
  it('only asks for verified courses, sorted by code', async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const service = new CoursesService({
      courses: { findMany },
    } as unknown as PrismaService);

    await service.findVerified();

    const args = findMany.mock.calls[0][0];
    expect(args.where).toEqual({ is_verified: true });
    expect(args.orderBy).toEqual({ code: 'asc' });
  });

  it('returns each course with its college', async () => {
    const findMany = vi.fn().mockResolvedValue([
      {
        course_id: 1,
        code: 'STSWENG',
        name: 'Software Engineering',
        colleges: { college_id: 2, name: 'College of Computer Studies' },
      },
    ]);
    const service = new CoursesService({
      courses: { findMany },
    } as unknown as PrismaService);

    await expect(service.findVerified()).resolves.toEqual([
      {
        course_id: 1,
        code: 'STSWENG',
        name: 'Software Engineering',
        college: { college_id: 2, name: 'College of Computer Studies' },
      },
    ]);
  });
});
