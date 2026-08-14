import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Application } from '../applications/entities/application.entity';
import { SavedJob } from '../saved-jobs/entities/saved-job.entity';

import { ApplicationStatus } from '../applications/enums/application-status.enum';

@Injectable()
export class JobSeekerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(SavedJob)
    private readonly savedJobRepository: Repository<SavedJob>,
  ) {}

  async getDashboard(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [
      totalApplications,
      totalSavedJobs,
      totalInterviews,
      recentApplications,
      recentSavedJobs,
    ] = await Promise.all([
      // ============================================
      // TOTAL APPLICATIONS
      // ============================================

      this.applicationRepository.count({
        where: {
          seeker: {
            id: userId,
          },
        },
      }),

      // ============================================
      // TOTAL SAVED JOBS
      // ============================================

      this.savedJobRepository.count({
        where: {
          user: {
            id: userId,
          },
        },
      }),

      // ============================================
      // TOTAL INTERVIEWS
      // ============================================

      this.applicationRepository.count({
        where: {
          seeker: {
            id: userId,
          },
          status: ApplicationStatus.INTERVIEW,
        },
      }),

      // ============================================
      // RECENT APPLICATIONS
      // ============================================

      this.applicationRepository.find({
        where: {
          seeker: {
            id: userId,
          },
        },

        relations: {
          job: {
            company: true,
          },
        },

        order: {
          createdAt: 'DESC',
        },

        take: 5,
      }),

      // ============================================
      // RECENT SAVED JOBS
      // ============================================

      this.savedJobRepository.find({
        where: {
          user: {
            id: userId,
          },
        },

        relations: {
          job: {
            company: true,
          },
        },

        order: {
          createdAt: 'DESC',
        },

        take: 5,
      }),
    ]);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },

      stats: {
        applications: totalApplications,
        savedJobs: totalSavedJobs,
        interviews: totalInterviews,
        profileComplete: this.calculateProfileCompletion(user),
      },

      recentApplications,

      recentSavedJobs,
    };
  }

  private calculateProfileCompletion(user: User): number {
    const fields = [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.location,
      user.professionalTitle,
      user.bio,
      user.profileImageUrl,
      user.resumeUrl,
    ];

    const completedFields = fields.filter(
      field =>
        field !== null &&
        field !== undefined &&
        field !== '',
    ).length;

    return Math.round(
      (completedFields / fields.length) * 100,
    );
  }
}