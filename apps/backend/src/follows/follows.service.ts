import { Injectable, BadRequestException, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  // Follow another user
  async followUser(followerId: string, followingId: string) {
    // Prevent users from following themselves
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // Make sure the target user exists
    const targetUser = await this.prisma.users.findUnique({
      where: { id: followingId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Create the follow relationship if it doesn't already exist
    await this.prisma.follows.upsert({
      where: {
        follower_id_following_id: {
          follower_id: followerId,
          following_id: followingId,
        },
      },
      update: {},
      create: {
        follower_id: followerId,
        following_id: followingId,
      },
    });

    return { message: 'User followed successfully' };
  }

  // Unfollow another user
  async unfollowUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    await this.prisma.follows.deleteMany({
      where: {
        follower_id: followerId,
        following_id: followingId,
      },
    });

    return { message: 'User unfollowed successfully' };
  }

  // Check whether the current user follows another user
  async getFollowStatus(followerId: string, followingId: string) {
    const follow = await this.prisma.follows.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: followerId,
          following_id: followingId,
        },
      },
    });

    return { isFollowing: !!follow };
  }

  // Get a user's follower and following counts
  async getFollowCounts(userId: string) {
    const [followers, following] = await Promise.all([
      this.prisma.follows.count({
        where: { following_id: userId },
      }),
      this.prisma.follows.count({
        where: { follower_id: userId },
      }),
    ]);

    return {
      followers,
      following,
    };
  }


  // Get the users who follow a specific user
async getFollowers(userId: string) {
  const follows = await this.prisma.follows.findMany({
    where: {
      following_id: userId,
    },
    include: {
      users_follows_follower_idTousers: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar_url: true,
          user_courses: {
            include: {
              courses: {
                select: {
                  code: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return follows.map((follow) => follow.users_follows_follower_idTousers);
}

    // Get the users a specific user follows
    async getFollowing(userId: string) {
    const follows = await this.prisma.follows.findMany({
        where: {
        follower_id: userId,
        },
        include: {
        users_follows_following_idTousers: {
            select: {
            id: true,
            name: true,
            username: true,
            avatar_url: true,
            user_courses: {
                include: {
                courses: {
                    select: {
                    code: true,
                    },
                },
                },
            },
            },
        },
        },
    });

    return follows.map((follow) => follow.users_follows_following_idTousers);
    }
}
