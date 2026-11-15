import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { MAX_FILES_PER_POST } from '../posts.constants.js';
import { PostFileDto } from './post-file.dto.js';

// The only statuses a user may choose. The rest (pending_review, archived,
// deleted) are set by the server.
export const USER_STATUSES = ['draft', 'published'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreatePostDto {
  // Title. May be left empty while the post is a draft.
  @IsOptional()
  @Transform(trimString)
  @IsString()
  @MaxLength(200)
  header?: string;

  @IsInt()
  @Min(1)
  course_id: number;

  @IsOptional()
  @IsString()
  body?: string | null;

  // "Save Draft" sends draft, "Post Note" sends published. Defaults to draft.
  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: UserStatus;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_FILES_PER_POST)
  @ValidateNested({ each: true })
  @Type(() => PostFileDto)
  files?: PostFileDto[];
}
