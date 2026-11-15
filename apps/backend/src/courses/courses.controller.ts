import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@nestm/better-auth';
import { CoursesService } from './courses.service.js';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Verified courses only, for the course dropdown and course lists
  @Get()
  @AllowAnonymous()
  findVerified() {
    return this.coursesService.findVerified();
  }
}
