import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { JobsService } from './jobs.service';

import { CreateJobDto } from './dto/create-job.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';

import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY')
  createJob(
    @Body() dto: CreateJobDto,

    @CurrentUser() user: any,
  ) {
    return this.jobsService.create(dto, user);
  }
}
