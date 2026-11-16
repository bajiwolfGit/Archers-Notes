import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCourses() {
    return this.prisma.courses.findMany({
      select: {
        course_id: true,
        code: true,
        name: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }
}