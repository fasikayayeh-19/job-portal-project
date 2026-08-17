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
  // =====================================================
  // 1. FIND COMPANY
  // =====================================================

  const company = await this.companyRepository.findOne({
    where: {
      user: {
        id: userId,
      },
    },
  });

  if (!company) {
    throw new NotFoundException('Company profile not found');
  }

  // =====================================================
  // 2. FIND COMPANY JOBS
  // =====================================================

  const jobs = await this.jobRepository.find({
    where: {
      company: {
        id: company.id,
      },
    },
    relations: {
      applications: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });

  const jobIds = jobs.map((job) => job.id);

  // =====================================================
  // 3. NO JOBS
  // =====================================================

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

      applicationsOverTime: [],

      jobPerformance: [],

      recentApplications: [],

      recentJobs: [],
    };
  }

  // =====================================================
  // 4. FIND APPLICATIONS
  // =====================================================

  const applications =
    await this.applicationRepository.find({
      where: jobIds.map((jobId) => ({
        job: {
          id: jobId,
        },
      })),

      relations: {
        job: true,
        seeker: true,
      },

      order: {
        createdAt: 'DESC',
      },
    });

  // =====================================================
  // 5. BASIC STATISTICS
  // =====================================================

  const activeJobs = jobs.filter(
    (job) => job.status === JobStatus.PUBLISHED,
  ).length;

  const shortlisted = applications.filter(
    (application) =>
      application.status === ApplicationStatus.TEST ||
      application.status === ApplicationStatus.INTERVIEW,
  ).length;

  const hired = applications.filter(
    (application) =>
      application.status === ApplicationStatus.HIRED,
  ).length;

  // =====================================================
  // 6. APPLICATION STATUS
  // =====================================================

  const applicationStatus = {
    pendingReview: applications.filter(
      (application) =>
        application.status ===
        ApplicationStatus.PENDING_REVIEW,
    ).length,

    onTest: applications.filter(
      (application) =>
        application.status === ApplicationStatus.TEST,
    ).length,

    interview: applications.filter(
      (application) =>
        application.status === ApplicationStatus.INTERVIEW,
    ).length,

    hired: applications.filter(
      (application) =>
        application.status === ApplicationStatus.HIRED,
    ).length,

    declined: applications.filter(
      (application) =>
        application.status === ApplicationStatus.DECLINED,
    ).length,
  };

  // =====================================================
  // 7. APPLICATIONS OVER TIME - LAST 7 DAYS
  // =====================================================

 const applicationsOverTime: {
  day: string;
  value: number;
}[] = [];

for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const nextDate = new Date(date);

    nextDate.setDate(nextDate.getDate() + 1);

    const count = applications.filter((application) => {
      const createdAt = new Date(application.createdAt);

      return (
        createdAt >= date &&
        createdAt < nextDate
      );
    }).length;

    applicationsOverTime.push({
      day: date.toLocaleDateString('en-US', {
        weekday: 'short',
      }),

      value: count,
    });
  }

  // =====================================================
  // 8. JOB PERFORMANCE
  // =====================================================

  const jobPerformance = jobs
    .slice(0, 10)
    .map((job) => ({
      id: job.id,

      title: job.title,

      applications: applications.filter(
        (application) =>
          application.job.id === job.id,
      ).length,
    }));

  // =====================================================
  // 9. RECENT APPLICATIONS
  // =====================================================

  const recentApplications = applications
    .slice(0, 5)
    .map((application) => ({
      id: application.id,

      status: application.status,

      createdAt: application.createdAt,

      job: {
        id: application.job.id,
        title: application.job.title,
      },

      seeker: {
        id: application.seeker.id,
        firstName: application.seeker.firstName,
        lastName: application.seeker.lastName,
        email: application.seeker.email,
        profileImageUrl:
          application.seeker.profileImageUrl,
      },
    }));

  // =====================================================
  // 10. RECENT JOBS
  // =====================================================

  const recentJobs = jobs
    .slice(0, 5)
    .map((job) => ({
      id: job.id,

      title: job.title,

      status: job.status,

      createdAt: job.createdAt,

      applications:
        job.applications?.length ?? 0,
    }));

  // =====================================================
  // 11. FINAL RESPONSE
  // =====================================================

  return {
    company: {
      id: company.id,
      companyName: company.companyName,
    },

    stats: {
      totalJobs: jobs.length,

      activeJobs,

      applications: applications.length,

      shortlisted,

      hired,
    },

    applicationStatus,

    applicationsOverTime,

    jobPerformance,

    recentApplications,

    recentJobs,
  };
}
}