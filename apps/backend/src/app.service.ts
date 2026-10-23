import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getDbStatus() {
    const users = await this.prisma.users.count();
    const posts = await this.prisma.posts.count();
    return { database: 'connected', users, posts };
  }
}