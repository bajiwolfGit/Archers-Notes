import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import type { Multer } from 'multer';

export type ImageType = 'avatar' | 'cover';

@Injectable()
export class SupabaseStorageService {
  private readonly supabase: SupabaseClient;

  private readonly bucketName = 'profile-images';
  private readonly maxFileSize = 5 * 1024 * 1024;

  private readonly allowedTypes: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      throw new Error('Supabase environment variables are missing.');
    }

    this.supabase = createClient(
      supabaseUrl,
      supabaseSecretKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  async uploadImage(
    userId: string,
    type: ImageType,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No image was provided.');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('Image must not exceed 5 MB.');
    }

    const extension = this.allowedTypes[file.mimetype];

    if (!extension) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed.');
    }

    // Generate a unique path for every upload.
    const filePath = `${userId}/${type}/${randomUUID()}.${extension}`;

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new InternalServerErrorException('Image upload failed.');
    }

    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      path: filePath,
    };
  }
}
