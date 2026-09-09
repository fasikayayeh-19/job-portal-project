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
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JobStatus } from '../jobs/entities/job.entity';
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
 


  // ==============================
  // SUMMARY STATISTICS
  // ==============================


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
  async updateMyCompany(
  userId: string,
  dto: UpdateCompanyDto,
) {
  const company =
    await this.companyRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });

  if (!company) {
    throw new NotFoundException(
      'Company profile not found',
    );
  }

  Object.assign(company, dto);

  return this.companyRepository.save(company);
}

async updateLogo(
  userId: string,
  logoUrl: string,
) {
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

  company.logoUrl = logoUrl;

  return this.companyRepository.save(
    company,
  );
}
async findPublicCompanyById(id: string) {
  const company = await this.companyRepository
    .createQueryBuilder('company')
    .leftJoin('company.jobs', 'job', 'job.status = :jobStatus', {
      jobStatus: JobStatus.PUBLISHED,
    })
    .where('company.id = :id', { id })
    .andWhere('company.status = :companyStatus', {
      companyStatus: CompanyStatus.APPROVED,
    })
    .select('company.id', 'id')
    .addSelect('company.companyName', 'companyName')
    .addSelect('company.description', 'description')
    .addSelect('company.website', 'website')
    .addSelect('company.logoUrl', 'logoUrl')
    .addSelect('company.location', 'location')
    .addSelect('company.createdAt', 'createdAt')
    .addSelect('COUNT(job.id)', 'jobCount')
    .groupBy('company.id')
    .addGroupBy('company.companyName')
    .addGroupBy('company.description')
    .addGroupBy('company.website')
    .addGroupBy('company.location')
    .addGroupBy('company.logoUrl')
    .addGroupBy('company.createdAt')
    .getRawOne();

  if (!company) {
    throw new NotFoundException('Company not found');
  }

  const jobs = await this.companyRepository
    .createQueryBuilder('company')
    .leftJoin('company.jobs', 'job', 'job.status = :jobStatus', {
      jobStatus: JobStatus.PUBLISHED,
    })
    .leftJoin('job.jobType', 'jobType')
    .leftJoin('job.category', 'category')
    .where('company.id = :id', { id })
    .select('job.id', 'id')
    .addSelect('job.title', 'title')
    .addSelect('job.description', 'description')
    .addSelect('job.location', 'location')
    .addSelect('job.experience', 'experience')
    .addSelect('job.salary', 'salary')
    .addSelect('job.deadline', 'deadline')
    .addSelect('jobType.id', 'jobTypeId')
    .addSelect('jobType.name', 'jobTypeName')
    .addSelect('category.id', 'categoryId')
    .addSelect('category.name', 'categoryName')
    .getRawMany();

  return {
    id: company.id,
    companyName: company.companyName,
    description: company.description,
    website: company.website,
    logoUrl: company.logoUrl,
    location: company.location,
    jobCount: Number(company.jobCount),
    createdAt: company.createdAt,
    jobs: jobs.map((j) => ({
      id: j.id,
      title: j.title,
      description: j.description,
      location: j.location,
      experience: j.experience,
      salary: j.salary,
      deadline: j.deadline,
      jobType: j.jobTypeId ? { id: j.jobTypeId, name: j.jobTypeName } : null,
      category: j.categoryId ? { id: j.categoryId, name: j.categoryName } : null,
    })),
  };
}

async findPublicCompanies(
  page = 1,
  limit = 12,
  search?: string,
) {
  const skip = (page - 1) * limit;

  const query = this.companyRepository
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
    });

  if (search?.trim()) {
    query.andWhere(
      '(LOWER(company.companyName) LIKE LOWER(:search) OR LOWER(company.location) LIKE LOWER(:search))',
      {
        search: `%${search.trim()}%`,
      },
    );
  }

  query
    .select('company.id', 'id')
    .addSelect('company.companyName', 'companyName')
    .addSelect('company.description', 'description')
    .addSelect('company.website', 'website')
    .addSelect('company.location', 'location')
    .addSelect('company.logoUrl', 'logoUrl')
    .addSelect('COUNT(job.id)', 'jobCount')
    .addSelect('company.createdAt', 'createdAt')
    .groupBy('company.id')
    .addGroupBy('company.companyName')
    .addGroupBy('company.description')
    .addGroupBy('company.website')
    .addGroupBy('company.location')
    .addGroupBy('company.logoUrl')
    .addGroupBy('company.createdAt')
    .orderBy('company.createdAt', 'DESC')
    .skip(skip)
    .take(limit);

  const [data, total] = await Promise.all([
    query.getRawMany(),
    this.companyRepository
      .createQueryBuilder('company')
      .where('company.status = :companyStatus', {
        companyStatus: CompanyStatus.APPROVED,
      })
      .andWhere(
        search?.trim()
          ? '(LOWER(company.companyName) LIKE LOWER(:search) OR LOWER(company.location) LIKE LOWER(:search))'
          : '1=1',
        search?.trim()
          ? { search: `%${search.trim()}%` }
          : {},
      )
      .getCount(),
  ]);

  return {
    data: data.map((company) => ({
      id: company.id,
      companyName: company.companyName,
      description: company.description,
      website: company.website,
      location: company.location,
      logoUrl: company.logoUrl,
      jobCount: Number(company.jobCount),
      createdAt: company.createdAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

}