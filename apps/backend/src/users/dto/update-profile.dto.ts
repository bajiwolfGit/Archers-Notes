import {
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string | null;

  @IsOptional()
  @IsInt()
  college_id?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  program?: string | null;

  @IsOptional()
  @IsInt()
  batch_id?: number | null;

  @IsOptional()
  @IsBoolean()
  in_app_notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  email_notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  comment_notifications?: boolean;
}
