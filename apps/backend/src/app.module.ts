import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BetterAuthModule } from '@nestm/better-auth';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { auth } from './auth.js';
import { UsersModule } from './users/users.module.js';
import { PostsModule } from './posts/posts.module.js';
import { CoursesModule } from './courses/courses.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    BetterAuthModule.forRoot({ auth }),
    UsersModule,
    PostsModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}