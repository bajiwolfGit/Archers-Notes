import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { MAX_FILES_PER_POST } from '../posts.constants.js';
import {
  trimString,
  USER_STATUSES,
  type UserStatus,
} from './create-post.dto.js';
import { PostFileDto } from './post-file.dto.js';

// Every field is optional: whatever is left out stays as it is.
export class UpdatePostDto {
  @IsOptional()
  @Transform(trimString)
  @IsString()
  @MaxLength(200)
  header?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  course_id?: number;

  @IsOptional()
  @IsString()
  body?: string | null;

  // draft -> published publishes a draft; published -> draft unpublishes.
  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: UserStatus;

  // New files to attach. Files already on the post are kept.
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_FILES_PER_POST)
  @ValidateNested({ each: true })
  @Type(() => PostFileDto)
  add_files?: PostFileDto[];

  // file_id of each existing file to remove from the post.
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  remove_file_ids?: string[];
}
