    import { Injectable, NotFoundException } from '@nestjs/common';
    import { PrismaService } from '../prisma/prisma.service.js';

    @Injectable()
    export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    // Retrieve a user's profile
    async getProfile(userId: string) {
        const user = await this.prisma.users.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            gmail: true,
            username: true,
            bio: true,
            avatar_url: true,
        },
        });

        if (!user) {
        throw new NotFoundException('User not found');
        }

        return user;
    }

    // Update a user's profile
    async updateProfile(
        userId: string,
        data: {
        name?: string;
        bio?: string | null;
        },
    ) {
        const user = await this.prisma.users.update({
        where: { id: userId },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.bio !== undefined && { bio: data.bio }),
        },
        select: {
            id: true,
            name: true,
            gmail: true,
            username: true,
            bio: true,
            avatar_url: true,
        },
        });

        return user;
    }
    }
