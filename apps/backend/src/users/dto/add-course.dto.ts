import { IsInt } from 'class-validator';

export class AddCourseDto {
  @IsInt()
  course_id: number;
}