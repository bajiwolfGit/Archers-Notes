import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseStorageService, type ImageType } from '../storage/supabase-storage.service.js';
import type { Express } from 'express';

@Injectable()
export class UsersService {
constructor(private readonly prisma: PrismaService,
            private readonly storageService: SupabaseStorageService,
) {}

 // Retrieve a user's profile
async getProfile(userId: string) {
  const user = await this.prisma.users.findUnique({
    where: { id: userId },
    select: {
      // User Stuff
      id: true,
      name: true,
      gmail: true,
      username: true,
      bio: true,
      avatar_url: true,
      cover_url: true,
      created_at: true,

      // Academic information
      college_id: true,
      program: true,
      batch_id: true,

      // Notification preferences
      in_app_notifications: true,
      email_notifications: true,
      comment_notifications: true,

      // Existing relations
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
    cover_url: user.cover_url,
    created_at: user.created_at,
    college: user.colleges,
    courses: user.user_courses.map((item) => item.courses),
    college_id: user.college_id,
    program: user.program,
    batch_id: user.batch_id,

    in_app_notifications: user.in_app_notifications,
    email_notifications: user.email_notifications,
    comment_notifications: user.comment_notifications,
  };
}

// Retrieve another user's public profile
async getPublicProfile(userId: string) {
  const user = await this.prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatar_url: true,
      cover_url: true,
      created_at: true,

      // Academic information
      college_id: true,
      program: true,
      colleges: {
        select: {
          college_id: true,
          name: true,
        },
      },

      // Courses
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
    username: user.username,
    bio: user.bio,
    avatar_url: user.avatar_url,
    cover_url: user.cover_url,
    created_at: user.created_at,
    college_id: user.college_id,
    college: user.colleges,
    program: user.program,
    courses: user.user_courses.map((item) => item.courses),
  };
}

async updateProfile(
  userId: string,
  data: {
    name?: string;
    bio?: string | null;
    college_id?: number | null;
    program?: string | null;
    batch_id?: number | null;
    in_app_notifications?: boolean;
    email_notifications?: boolean;
    comment_notifications?: boolean;
  },
) {
  await this.prisma.users.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.program !== undefined && { program: data.program, }),
      ...(data.batch_id !== undefined && {batch_id: data.batch_id, }),
      ...(data.in_app_notifications !== undefined && { in_app_notifications: data.in_app_notifications, }),
      ...(data.email_notifications !== undefined && { email_notifications: data.email_notifications, }),
      ...(data.comment_notifications !== undefined && { comment_notifications: data.comment_notifications, }),
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

async uploadImage(
  userId: string,
  type: ImageType,
  file: Express.Multer.File,
) {
  // Upload the image to Supabase Storage
  const uploadedImage = await this.storageService.uploadImage(
    userId,
    type,
    file,
  );

  // Save the resulting URL in the user's database record
  await this.prisma.users.update({
    where: { id: userId },
    data:
      type === 'avatar'
        ? { avatar_url: uploadedImage.url }
        : { cover_url: uploadedImage.url },
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