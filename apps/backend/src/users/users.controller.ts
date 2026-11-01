import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '@nestm/better-auth';
import { auth } from '../auth.js';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

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
}