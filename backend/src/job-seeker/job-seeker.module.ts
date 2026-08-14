import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobSeekerController } from './job-seeker.controller';
import { JobSeekerService } from './job-seeker.service';

import { User } from '../users/entities/user.entity';
import { Application } from '../applications/entities/application.entity';
import { SavedJob } from '../saved-jobs/entities/saved-job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Application,
      SavedJob,
    ]),
  ],

  controllers: [
    JobSeekerController,
  ],

  providers: [
    JobSeekerService,
  ],
})
export class JobSeekerModule {}