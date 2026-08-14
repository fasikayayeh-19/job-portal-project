import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationStatus } from '../applications/enums/application-status.enum';
import { Company } from '../companies/entities/company.entity';

import {
  Job,
  JobStatus,
} from '../jobs/entities/job.entity';

import { Application } from '../applications/entities/application.entity';

@Injectable()
export class CompanyDashboardService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  // =====================================================
  // COMPANY DASHBOARD
  // =====================================================

  async getDashboard(userId: string) {
    // ---------------------------------------------------
    // 1. Find company belonging to logged-in user
    // ---------------------------------------------------

    const company =
      await this.companyRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });

    if (!company) {
      throw new NotFoundException(
        'Company profile not found',
      );
    }

    // ---------------------------------------------------
    // 2. Get company's jobs
    // ---------------------------------------------------

    const jobs =
      await this.jobRepository.find({
        where: {
          company: {
            id: company.id,
          },
        },
        relations: {applications:true},
        order: {
          createdAt: 'DESC',
        },
      });

    // ---------------------------------------------------
    // 3. Get job IDs
    // ---------------------------------------------------

    const jobIds = jobs.map(
      (job) => job.id,
    );

    // ---------------------------------------------------
    // 4. If company has no jobs
    // ---------------------------------------------------

    if (jobIds.length === 0) {
      return {
        company: {
          id: company.id,
          companyName: company.companyName,
        },

        stats: {
          totalJobs: 0,
          activeJobs: 0,
          applications: 0,
          shortlisted: 0,
          hired: 0,
        },

        applicationStatus: {
          pendingReview: 0,
          onTest: 0,
          interview: 0,
          hired: 0,
          declined: 0,
        },

        recentApplications: [],

        recentJobs: [],
      };
    }

    // ---------------------------------------------------
    // 5. Get all applications for company's jobs
    // ---------------------------------------------------

    const applications =
      await this.applicationRepository.find({
        where: jobIds.map((jobId) => ({
          job: {
            id: jobId,
          },
        })),

        relations: {
             job:true,
          seeker:true,
        }
         
        ,

        order: {
          createdAt: 'DESC',
        },
      });

    // ===================================================
    // STATISTICS
    // ===================================================

    // Published jobs = Active Jobs
    const activeJobs =
      jobs.filter(
        (job) =>
          job.status === JobStatus.PUBLISHED,
      ).length;

    // ON_TEST + INTERVIEW
    const shortlisted =
      applications.filter(
        (application) =>
         application.status === ApplicationStatus.TEST||
          application.status === 'INTERVIEW',
      ).length;

    // HIRED
    const hired =
      applications.filter(
        (application) =>
          application.status === 'HIRED',
      ).length;

    // ===================================================
    // APPLICATION STATUS
    // ===================================================

    const applicationStatus = {
      pendingReview:
        applications.filter(
          (application) =>
            application.status ===
            'PENDING_REVIEW',
        ).length,

      onTest:
        applications.filter(
          (application) =>
            application.status === ApplicationStatus.TEST,
        ).length,

      interview:
        applications.filter(
          (application) =>
            application.status ===
            'INTERVIEW',
        ).length,

      hired:
        applications.filter(
          (application) =>
            application.status ===
            'HIRED',
        ).length,

      declined:
        applications.filter(
          (application) =>
            application.status ===
            'DECLINED',
        ).length,
    };

    // ===================================================
    // RECENT APPLICATIONS
    // ===================================================

    const recentApplications =
      applications
        .slice(0, 5)
        .map((application) => ({
          id: application.id,

          status: application.status,

          createdAt:
            application.createdAt,

          job: {
            id: application.job.id,
            title: application.job.title,
          },

          seeker: {
            id: application.seeker.id,

            firstName:
              application.seeker.firstName,

            lastName:
              application.seeker.lastName,

            email:
              application.seeker.email,

            profileImageUrl:
              application.seeker.profileImageUrl,
          },
        }));

    // ===================================================
    // RECENT JOBS
    // ===================================================

    const recentJobs =
      jobs
        .slice(0, 5)
        .map((job) => ({
          id: job.id,

          title: job.title,

          status: job.status,

          createdAt:
            job.createdAt,

          applications:
            job.applications?.length ?? 0,
        }));

    // ===================================================
    // FINAL RESPONSE
    // ===================================================

    return {
      company: {
        id: company.id,
        companyName: company.companyName,
      },

      stats: {
        totalJobs: jobs.length,

        activeJobs,

        applications:
          applications.length,

        shortlisted,

        hired,
      },

      applicationStatus,

      recentApplications,

      recentJobs,
    };
  }
}