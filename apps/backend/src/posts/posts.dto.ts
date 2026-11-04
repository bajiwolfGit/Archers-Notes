import type { post_status } from '../generated/prisma/client.js';


export interface CreatePostDto {
  header: string;
  course_id: number;
  body?: string | null;
  status?: post_status;
}


export type UpdatePostDto = Partial<CreatePostDto>;