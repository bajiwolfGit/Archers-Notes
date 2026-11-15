import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { StorageModule } from '../storage/storage.module.js';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
