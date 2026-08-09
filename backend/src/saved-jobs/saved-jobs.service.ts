import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SavedJob } from './entities/saved-job.entity';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class SavedJobsService {
  constructor(
    @InjectRepository(SavedJob)
    private savedJobRepository: Repository<SavedJob>,

    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  // Save a job
  async saveJob(
    jobId: string,
    user: any,
  ) {
    // Check job exists
    const job = await this.jobRepository.findOne({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check already saved
    const existing = await this.savedJobRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        job: {
          id: jobId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Job already saved',
      );
    }

    const savedJob = this.savedJobRepository.create({
      user: {
        id: user.id,
      },
      job,
    });

    return this.savedJobRepository.save(savedJob);
  }

  // Get my saved jobs
  async findMySavedJobs(user: any) {
    return this.savedJobRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },

      relations: {
        job: {
          company: true,
          category: true,
        },
      },

      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Remove saved job
  async removeJob(
    jobId: string,
    user: any,
  ) {
    const savedJob =
      await this.savedJobRepository.findOne({
        where: {
          user: {
            id: user.id,
          },

          job: {
            id: jobId,
          },
        },
      });

    if (!savedJob) {
      throw new NotFoundException(
        'Saved job not found',
      );
    }

    await this.savedJobRepository.remove(
      savedJob,
    );

    return {
      message: 'Job removed from saved jobs',
    };
  }
}