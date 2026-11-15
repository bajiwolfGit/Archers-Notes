import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  // Courses a post can be filed under. Unverified courses are left out so they
  // never reach the "Course" dropdown.
  async findVerified() {
    const courses = await this.prisma.courses.findMany({
      where: { is_verified: true },
      orderBy: { code: 'asc' },
      select: {
        course_id: true,
        code: true,
        name: true,
        colleges: { select: { college_id: true, name: true } },
      },
    });

    return courses.map(({ colleges, ...course }) => ({
      ...course,
      college: colleges,
    }));
  }
}
