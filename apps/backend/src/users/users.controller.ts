import { Body, Controller, Get, Patch, Post, Delete, Param, ParseIntPipe, UploadedFile, UseInterceptors} from '@nestjs/common';
import { CurrentUser, type AuthUser } from '@nestm/better-auth';
import { auth } from '../auth.js';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { AddCourseDto } from './dto/add-course.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get the logged-in user's profile
  @Get('me')
  getMyProfile(@CurrentUser() user: AuthUser<typeof auth>) {
    return this.usersService.getProfile(user.id);
  }

  // Update the logged-in user's profile
  @Patch('me')
  updateMyProfile(
    @CurrentUser() user: AuthUser<typeof auth>,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  // Add a course to the logged-in user's profile
  @Post('me/courses')
  addCourse(
    @CurrentUser() user: AuthUser<typeof auth>,
    @Body() dto: AddCourseDto,
  ) {
    return this.usersService.addCourse(user.id, dto.course_id);
  }

  // Remove a course from the logged-in user's profile
  @Delete('me/courses/:courseId')
  removeCourse(
    @CurrentUser() user: AuthUser<typeof auth>,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.usersService.removeCourse(user.id, courseId);
  }

  // Upload the User's profile pic
  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadAvatar(
    @CurrentUser() user: AuthUser<typeof auth>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadImage(user.id, 'avatar', file);
  }

  // Upload the User's cover pic
  @Post('me/cover')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadCover(
    @CurrentUser() user: AuthUser<typeof auth>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadImage(user.id, 'cover', file);
  }
}

