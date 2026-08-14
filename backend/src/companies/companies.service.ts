import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompanyStatus } from './enums/company-status.enum';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // =====================================================
  // CREATE COMPANY
  // =====================================================

  async create(
    dto: CreateCompanyDto,
    user: User,
  ): Promise<Company> {
    const company = this.companyRepository.create({
      ...dto,
      user,
      status: CompanyStatus.PENDING,
    });

    return await this.companyRepository.save(company);
  }

  // =====================================================
  // GET MY COMPANY PROFILE
  // =====================================================
 
async getDashboard(userId: string) {
  const company = await this.companyRepository.findOne({
    where: {
      user: {
        id: userId,
      },
    },
    relations: {
      jobs: {
        applications: {
          seeker: true,
        },
      },
    },
  });

  if (!company) {
    throw new NotFoundException('Company profile not found');
  }

  const jobs = company.jobs ?? [];

  const applications = jobs.flatMap(
    (job) => job.applications ?? [],
  );

  // ==============================
  // SUMMARY STATISTICS
  // ==============================

  const activeJobs = jobs.filter(
    (job) => job.status === 'PUBLISHED',
  ).length;

  const totalApplications = applications.length;

  const shortlisted = applications.filter(
    (application) =>
      application.status === 'TEST' ||
      application.status === 'INTERVIEW',
  ).length;

  const hired = applications.filter(
    (application) => application.status === 'HIRED',
  ).length;

  // ==============================
  // APPLICATION STATUS
  // ==============================

  const statusCounts: Record<string, number> = {};

  applications.forEach((application) => {
    const status = application.status;

    statusCounts[status] =
      (statusCounts[status] || 0) + 1;
  });

  const applicationStatus = Object.entries(
    statusCounts,
  ).map(([status, count]) => ({
    status,
    count,
  }));

  // ==============================
  // RECENT APPLICATIONS
  // ==============================

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map((application) => ({
      id: application.id,

      applicant: {
        id: application.seeker.id,
        firstName: application.seeker.firstName,
        lastName: application.seeker.lastName,
        email: application.seeker.email,
      },

      job: {
        id: application.job.id,
        title: application.job.title,
      },

      status: application.status,

      createdAt: application.createdAt,
    }));

  return {
    stats: {
      activeJobs,
      totalApplications,
      shortlisted,
      hired,
    },

    applicationStatus,

    recentApplications,
  };
}


  async getMyCompany(userId: string) {
    const company =
      await this.companyRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {user:true},
      });

    if (!company) {
      throw new NotFoundException(
        'Company profile not found',
      );
    }

    return company;
  }
}