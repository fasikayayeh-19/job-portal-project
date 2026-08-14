import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { JobSeekerService } from './job-seeker.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { UserRole } from '../users/enums/user-role.enum';

@Controller('job-seeker')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobSeekerController {
  constructor(
    private readonly jobSeekerService: JobSeekerService,
  ) {}

  @Get('dashboard')
  @Roles(UserRole.JOB_SEEKER)
  async getDashboard(
    @CurrentUser() user: any,
  ) {
    return this.jobSeekerService.getDashboard(user.id);
  }
}