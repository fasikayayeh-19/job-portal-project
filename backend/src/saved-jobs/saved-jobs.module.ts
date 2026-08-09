import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SavedJobsController } from './saved-jobs.controller';
import { SavedJobsService } from './saved-jobs.service';
import { SavedJob } from './entities/saved-job.entity';
import { Job } from '../jobs/entities/job.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SavedJob,
      Job,
    ]),
  ],

  controllers: [SavedJobsController],

  providers: [SavedJobsService],
})
export class SavedJobsModule {}