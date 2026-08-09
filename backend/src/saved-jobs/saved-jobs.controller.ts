import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { SavedJobsService } from './saved-jobs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('saved-jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('JOB_SEEKER')
export class SavedJobsController {
  constructor(
    private readonly savedJobsService: SavedJobsService,
  ) {}

  // Save a job
  @Post(':jobId')
  saveJob(
    @Param('jobId') jobId: string,
    @Req() req: any,
  ) {
    return this.savedJobsService.saveJob(
      jobId,
      req.user,
    );
  }

  // Get my saved jobs
  @Get()
  findMySavedJobs(
    @Req() req: any,
  ) {
    return this.savedJobsService.findMySavedJobs(
      req.user,
    );
  }

  // Remove saved job
  @Delete(':jobId')
  removeJob(
    @Param('jobId') jobId: string,
    @Req() req: any,
  ) {
    return this.savedJobsService.removeJob(
      jobId,
      req.user,
    );
  }
}