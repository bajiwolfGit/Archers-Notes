import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@nestm/better-auth';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AllowAnonymous()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-check')
  @AllowAnonymous()
  getDbStatus() {
    return this.appService.getDbStatus();
  }
}