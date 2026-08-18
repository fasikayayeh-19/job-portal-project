import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Company } from '../companies/entities/company.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { CompanyStatus } from '../companies/enums/company-status.enum';
import { User } from '../users/entities/user.entity';
import { ApplicationStatus } from '../applications/enums/application-status.enum';
@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Company)
    private companyRepository: Repository<Company>,

    @InjectRepository(Job)
    private jobRepository: Repository<Job>,

    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}



  async getUsers() {
  return this.userRepository.find({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
    },

    order: {
      createdAt: 'DESC',
    },
  });
}
async getCompanies() {
  return this.companyRepository.find({
    relations: {
      user: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });
}

  async getPendingCompanies() {
    return this.companyRepository.find({
      where: {
        status: CompanyStatus.PENDING,
      },

      relations: {
        user:true,

    },
    });
  }

  async approveCompany(id: string) {
    await this.companyRepository.update(id, {
      status: CompanyStatus.APPROVED,
    });

    return {
      message: 'Company approved',
    };
  }

  async rejectCompany(id: string) {
    await this.companyRepository.update(id, {
      status: CompanyStatus.REJECTED,
    });

    return {
      message: 'Company rejected',
    };
  }

  async getApplications() {
  return this.applicationRepository.find({
    relations: {
      seeker: true,
      job: {
        company: true,
      },
    },

    order: {
      createdAt: 'DESC',
    },
  });
}
  async getJobs() {
  return this.jobRepository.find({
    relations: {
      company: true,
      category: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });
}

async getDashboardStats() {
  const [
    totalUsers,
    totalCompanies,
    pendingCompanies,
    approvedCompanies,
    totalJobs,
    totalApplications,

    applicationStatus,
    applicationsOverTime,
    jobsByCategory,
  ] = await Promise.all([
    // ============================================
    // BASIC STATISTICS
    // ============================================

    this.userRepository.count(),

    this.companyRepository.count(),

    this.companyRepository.count({
      where: {
        status: CompanyStatus.PENDING,
      },
    }),

    this.companyRepository.count({
      where: {
        status: CompanyStatus.APPROVED,
      },
    }),

    this.jobRepository.count(),

    this.applicationRepository.count(),

    // ============================================
    // APPLICATION STATUS
    // ============================================

    this.getApplicationStatus(),

    // ============================================
    // APPLICATIONS OVER TIME
    // ============================================

    this.applicationRepository
      .createQueryBuilder('application')
      .select(
        "TO_CHAR(DATE_TRUNC('month', application.createdAt), 'YYYY-MM')",
        'month',
      )
      .addSelect('COUNT(application.id)', 'applications')
      .groupBy(
        "DATE_TRUNC('month', application.createdAt)",
      )
      .orderBy(
        "DATE_TRUNC('month', application.createdAt)",
        'ASC',
      )
      .getRawMany(),

    // ============================================
    // JOBS BY CATEGORY
    // ============================================

    this.jobRepository
      .createQueryBuilder('job')
      .leftJoin('job.category', 'category')
      .select('category.name', 'category')
      .addSelect('COUNT(job.id)', 'jobs')
      .where('category.name IS NOT NULL')
      .groupBy('category.name')
      .orderBy('COUNT(job.id)', 'DESC')
      .getRawMany(),
  ]);

  return {
    totalUsers,
    totalCompanies,
    pendingCompanies,
    approvedCompanies,
    totalJobs,
    totalApplications,

    applicationStatus,

    companyStatus: {
      pending: pendingCompanies,
      approved: approvedCompanies,
    },

    applicationsOverTime: applicationsOverTime.map((item) => ({
      month: item.month,
      applications: Number(item.applications),
    })),

    jobsByCategory: jobsByCategory.map((item) => ({
      category: item.category,
      jobs: Number(item.jobs),
    })),
  };
}

private async getApplicationStatus() {
  const [
    pendingReview,
    test,
    interview,
    hired,
    declined,
  ] = await Promise.all([
    this.applicationRepository.count({
      where: {
        status: ApplicationStatus.PENDING_REVIEW,
      },
    }),

    this.applicationRepository.count({
      where: {
        status: ApplicationStatus.TEST,
      },
    }),

    this.applicationRepository.count({
      where: {
        status: ApplicationStatus.INTERVIEW,
      },
    }),

    this.applicationRepository.count({
      where: {
        status: ApplicationStatus.HIRED,
      },
    }),

    this.applicationRepository.count({
      where: {
        status: ApplicationStatus.DECLINED,
      },
    }),
  ]);

  return {
    pendingReview,
    test,
    interview,
    hired,
    declined,
  };
}
}
