import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Job, JobStatus } from '../jobs/entities/job.entity';
import { Category } from '../categories/entities/category.entity';
import { Company } from '../companies/entities/company.entity';
import { CompanyStatus } from '../companies/enums/company-status.enum';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getHomeData() {
    const [
  categories,
  latestJobs,
  trustedCompanies,
  totalJobs,
  totalCompanies,
] = await Promise.all([
      // ==========================================
      // ALL CATEGORIES + PUBLISHED JOB COUNT
      // ==========================================

      this.categoryRepository
        .createQueryBuilder('category')
        .leftJoin(
          'category.jobs',
          'job',
          'job.status = :status',
          {
            status: JobStatus.PUBLISHED,
          },
        )
        .select('category.id', 'id')
        .addSelect('category.name', 'name')
        .addSelect('COUNT(job.id)', 'jobCount')
        .groupBy('category.id')
        .addGroupBy('category.name')
        .orderBy('category.name', 'ASC')
        .getRawMany(),

      // ==========================================
      // LATEST PUBLISHED JOBS
      // ==========================================

      this.jobRepository.find({
        where: {
          status: JobStatus.PUBLISHED,
        },

        relations: {
          company: true,
          category: true,
          jobType: true,
        },

        order: {
          createdAt: 'DESC',
        },

        take: 3,
      }),

      // ==========================================
// TRUSTED COMPANIES
// APPROVED COMPANIES WITH LOGOS
// ==========================================

this.companyRepository
  .createQueryBuilder('company')
  .leftJoin(
    'company.jobs',
    'job',
    'job.status = :jobStatus',
    {
      jobStatus: JobStatus.PUBLISHED,
    },
  )
  .where('company.status = :companyStatus', {
    companyStatus: CompanyStatus.APPROVED,
  })
  .andWhere('company.logoUrl IS NOT NULL')
  .andWhere("company.logoUrl != ''")
  .select('company.id', 'id')
  .addSelect('company.companyName', 'companyName')
  .addSelect('company.logoUrl', 'logoUrl')
  .addSelect('COUNT(job.id)', 'jobCount')
  .groupBy('company.id')
  .addGroupBy('company.companyName')
  .addGroupBy('company.logoUrl')
  .orderBy('company.createdAt', 'DESC')
  .take(12)
  .getRawMany(),

      // ==========================================
      // TOTAL PUBLISHED JOBS
      // ==========================================

      this.jobRepository.count({
        where: {
          status: JobStatus.PUBLISHED,
        },
      }),

      // ==========================================
      // TOTAL APPROVED COMPANIES
      // ==========================================

      this.companyRepository.count({
        where: {
          status: CompanyStatus.APPROVED,
        },
      }),
    ]);

    return {
      stats: {
        totalJobs,
        totalCompanies,
        totalCategories: categories.length,
      },

      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        jobCount: Number(category.jobCount),
      })),

      latestJobs: latestJobs.map((job) => ({
        id: job.id,
        title: job.title,
        location: job.location,
        salary: job.salary,
        experience: job.experience,
        deadline: job.deadline,
        createdAt: job.createdAt,

        company: job.company
          ? {
              id: job.company.id,
              companyName: job.company.companyName,
            }
          : null,

        category: job.category
          ? {
              id: job.category.id,
              name: job.category.name,
            }
          : null,

        jobType: job.jobType
          ? {
              id: job.jobType.id,
              name: job.jobType.name,
            }
          : null,
      })),
      trustedCompanies: trustedCompanies.map((company) => ({
        id: company.id,
        companyName: company.companyName,
        logoUrl: company.logoUrl,
        jobCount: Number(company.jobCount),
      })),
    };
  }
}