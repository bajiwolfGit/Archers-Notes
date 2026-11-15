import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

// GET /posts?course=STSWENG
export class ListPostsQueryDto {
  // Course code; matching ignores letter case
  @IsOptional()
  @IsString()
  @MaxLength(20)
  course?: string;
}

// Statuses the owner can filter their own posts by. Deleted posts are never
// returned.
export const OWN_POST_STATUSES = [
  'draft',
  'pending_review',
  'published',
  'archived',
] as const;

// GET /posts/mine?status=draft
export class ListMyPostsQueryDto {
  @IsOptional()
  @IsIn(OWN_POST_STATUSES)
  status?: (typeof OWN_POST_STATUSES)[number];
}
