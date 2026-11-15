import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
constructor(private readonly prisma: PrismaService) {}

 // Retrieve a user's profile
async getProfile(userId: string) {
  const user = await this.prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      gmail: true,
      username: true,
      bio: true,
      avatar_url: true,
      colleges: {
        select: {
          college_id: true,
          name: true,
        },
      },
      user_courses: {
        select: {
          courses: {
            select: {
              course_id: true,
              code: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return {
    id: user.id,
    name: user.name,
    gmail: user.gmail,
    username: user.username,
    bio: user.bio,
    avatar_url: user.avatar_url,
    college: user.colleges,
    courses: user.user_courses.map((item) => item.courses),
  };
}

async updateProfile(
  userId: string,
  data: {
    name?: string;
    bio?: string | null;
    college_id?: number | null;
  },
) {
  await this.prisma.users.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.college_id !== undefined && {
        colleges:
          data.college_id === null
            ? { disconnect: true }
            : { connect: { college_id: data.college_id } },
      }),
    },
  });

  return this.getProfile(userId);
}

// Add a course to the user's profile
async addCourse(userId: string, courseId: number) {
  // Make sure the selected course exists
  const course = await this.prisma.courses.findUnique({
    where: { course_id: courseId },
  });

  if (!course) {
    throw new NotFoundException('Course not found');
  }

  // Add the course, or leave it unchanged if already selected
  await this.prisma.user_courses.upsert({
    where: {
      user_id_course_id: {
        user_id: userId,
        course_id: courseId,
      },
    },
    update: {},
    create: {
      user_id: userId,
      course_id: courseId,
    },
  });

  return this.getProfile(userId);
}

// Remove a course from the user's profile
async removeCourse(userId: string, courseId: number) {
  await this.prisma.user_courses.deleteMany({
    where: {
      user_id: userId,
      course_id: courseId,
    },
  });

  return this.getProfile(userId);
}
}