import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BetterAuthModule } from '@nestm/better-auth';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { auth } from './auth.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    BetterAuthModule.forRoot({ auth }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}