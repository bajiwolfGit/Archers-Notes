import { Controller, Post, Delete, Get, Param, ParseUUIDPipe, } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '@nestm/better-auth';
import { auth } from '../auth.js';
import { FollowsService } from './follows.service.js';

@Controller('follows')
export class FollowsController {
    constructor(private readonly followsService: FollowsService) {}

    // Follow another user
    @Post(':userId')
    followUser(
        @CurrentUser() user: AuthUser<typeof auth>,
        @Param('userId', ParseUUIDPipe) userId: string,
    ) {
        return this.followsService.followUser(user.id, userId);
    }

    // Unfollow another user
    @Delete(':userId')
    unfollowUser(
        @CurrentUser() user: AuthUser<typeof auth>,
        @Param('userId', ParseUUIDPipe) userId: string,
    ) {
        return this.followsService.unfollowUser(user.id, userId);
    }

    // Check whether the logged-in user follows another user
    @Get(':userId/status')
    getFollowStatus(
        @CurrentUser() user: AuthUser<typeof auth>,
        @Param('userId', ParseUUIDPipe) userId: string,
    ) {
        return this.followsService.getFollowStatus(user.id, userId);
    }

    // Get another user's follower and following counts
    @Get(':userId/counts')
    getFollowCounts(
        @Param('userId', ParseUUIDPipe) userId: string,
    ) {
        return this.followsService.getFollowCounts(userId);
    }

    // Get the users who follow a specific user
    @Get(':userId/followers')
    getFollowers(
    @Param('userId', ParseUUIDPipe) userId: string,
    ) {
    return this.followsService.getFollowers(userId);
    }

    // Get the users a specific user follows
    @Get(':userId/following')
    getFollowing(
    @Param('userId', ParseUUIDPipe) userId: string,
    ) {
    return this.followsService.getFollowing(userId);
    }
}
