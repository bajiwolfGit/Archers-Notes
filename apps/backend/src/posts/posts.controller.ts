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
  Query,
} from '@nestjs/common';
import {
  AllowAnonymous,
  CurrentUser,
  OptionalAuth,
  type AuthUser,
} from '@nestm/better-auth';
import type { auth } from '../auth.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import {
  ListMyPostsQueryDto,
  ListPostsQueryDto,
} from './dto/list-posts-query.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { PostsService } from './posts.service.js';

type LoggedInUser = AuthUser<typeof auth>;

// Routes are login-only unless marked otherwise: BetterAuthModule registers a
// global guard that rejects requests without a session.
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Feed of published posts. Optional filter: GET /posts?course=STSWENG
  @Get()
  @AllowAnonymous()
  findAll(@Query() query: ListPostsQueryDto) {
    return this.postsService.findAll(query);
  }

  // The logged-in user's own posts. GET /posts/mine?status=draft lists drafts.
  // Declared before ':id' so "mine" is not read as a post id.
  @Get('mine')
  findMine(
    @CurrentUser() user: LoggedInUser,
    @Query() query: ListMyPostsQueryDto,
  ) {
    return this.postsService.findMine(user.id, query);
  }

  // One post. Published posts are public; a draft only opens for its author.
  @Get(':id')
  @OptionalAuth()
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: LoggedInUser | null,
  ) {
    return this.postsService.findOne(id, user?.id);
  }

  // Create a post or save a draft, depending on "status"
  @Post()
  create(@CurrentUser() user: LoggedInUser, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.id, dto);
  }

  // Edit a post, publish a draft, or add/remove files. Author only.
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: LoggedInUser,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, user.id, dto);
  }

  // Delete a post or draft. Author only.
  @Delete(':id')
  @HttpCode(204)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: LoggedInUser,
  ) {
    return this.postsService.remove(id, user.id);
  }
}
