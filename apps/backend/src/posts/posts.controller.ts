import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AllowAnonymous, CurrentUser, OptionalAuth } from '@nestm/better-auth';
import { PostsService } from './posts.service.js';
import type { CreatePostDto, UpdatePostDto } from './posts.dto.js';

// The only part of the logged-in user we need
type LoggedInUser = { id: string };

// TEMPORARY, local testing only: when nobody is logged in, act as DEV_USER_ID from .env.
// Delete these two functions and put the routes back to normal before committing.
function devUserId(user: LoggedInUser | null): string | undefined {
  if (user) return user.id;
  if (process.env.NODE_ENV === 'production') return undefined;
  return process.env.DEV_USER_ID;
}

function requireUserId(user: LoggedInUser | null): string {
  const id = devUserId(user);
  if (!id) throw new UnauthorizedException();
  return id;
}

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @AllowAnonymous()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @OptionalAuth()
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: LoggedInUser | null,
  ) {
    return this.postsService.findOne(id, devUserId(user));
  }

  @Post()
  @OptionalAuth()
  create(
    @CurrentUser() user: LoggedInUser | null,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.create(requireUserId(user), dto);
  }

  @Patch(':id')
  @OptionalAuth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: LoggedInUser | null,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, requireUserId(user), dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @OptionalAuth()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: LoggedInUser | null,
  ) {
    return this.postsService.remove(id, requireUserId(user));
  }
}