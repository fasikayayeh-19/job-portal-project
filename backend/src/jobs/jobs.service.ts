import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Job, JobStatus } from './entities/job.entity';

import { Company } from '../companies/entities/company.entity';
import { AdminJobQueryDto } from './dto/admin-job-query.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { Category } from '../categories/entities/category.entity';
import { CompanyStatus } from '../companies/enums/company-status.enum';
import { JobQueryDto } from './dto/job-query.dto';
import { UpdateJobDto } from './dto/update-job.dto';
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,

    @InjectRepository(Company)
    private companyRepository: Repository<Company>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    dto: CreateJobDto,

    user: any,
  ) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: dto.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const company = await this.companyRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    if (!company) {
      throw new ForbiddenException('Company profile not found');
    }

    if (company.status !== CompanyStatus.APPROVED) {
      throw new ForbiddenException('Company is not approved');
    }

    const job = this.jobRepository.create({
      ...dto,

      company,
      category,
    });

    return this.jobRepository.save(job);
  }
// =====================================================
// PUBLIC - ALL APPROVED COMPANY JOBS
// =====================================================

async findAll(query: JobQueryDto) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const qb = this.jobRepository
    .createQueryBuilder('job')
    .leftJoinAndSelect('job.company', 'company')
    .leftJoinAndSelect('job.category', 'category');

  // ===================================================
  // ONLY JOBS FROM APPROVED COMPANIES
  // ===================================================

  qb.andWhere(
    'company.status = :companyStatus',
    {
      companyStatus: CompanyStatus.APPROVED,
    },
  );

  // ===================================================
  // DO NOT SHOW CLOSED JOBS
  // ===================================================

  qb.andWhere(
    'job.status != :jobStatus',
    {
      jobStatus: JobStatus.CLOSED,
    },
  );

  // ===================================================
  // SEARCH
  // ===================================================

  if (query.search) {
    qb.andWhere(
      `(
        LOWER(job.title) LIKE LOWER(:search)
        OR LOWER(job.description) LIKE LOWER(:search)
        OR LOWER(job.location) LIKE LOWER(:search)
      )`,
      {
        search: `%${query.search}%`,
      },
    );
  }

  // ===================================================
  // LOCATION
  // ===================================================

  if (query.location) {
    qb.andWhere(
      'LOWER(job.location) LIKE LOWER(:location)',
      {
        location: `%${query.location}%`,
      },
    );
  }

  // ===================================================
  // CATEGORY
  // ===================================================

  if (query.categoryId) {
    qb.andWhere(
      'category.id = :categoryId',
      {
        categoryId: query.categoryId,
      },
    );
  }

  // ===================================================
  // JOB TYPE
  // ===================================================

  if (query.jobType) {
    qb.andWhere(
      'job.jobType = :jobType',
      {
        jobType: query.jobType,
      },
    );
  }

  // ===================================================
  // POSTED WITHIN
  // ===================================================

  if (query.postedWithin) {
    const now = new Date();

    let fromDate: Date | null = null;

    if (query.postedWithin === 'today') {
      fromDate = new Date(now);
      fromDate.setHours(0, 0, 0, 0);
    }

    if (query.postedWithin === 'yesterday') {
      fromDate = new Date(now);
      fromDate.setDate(
        fromDate.getDate() - 1,
      );
      fromDate.setHours(0, 0, 0, 0);
    }

    if (query.postedWithin === 'week') {
      fromDate = new Date(now);
      fromDate.setDate(
        fromDate.getDate() - 7,
      );
    }

    if (query.postedWithin === 'month') {
      fromDate = new Date(now);
      fromDate.setMonth(
        fromDate.getMonth() - 1,
      );
    }

    if (fromDate) {
      qb.andWhere(
        'job.createdAt >= :fromDate',
        {
          fromDate,
        },
      );
    }
  }

  // ===================================================
  // ORDER
  // ===================================================

  qb.orderBy(
    'job.createdAt',
    'DESC',
  );

  // ===================================================
  // PAGINATION
  // ===================================================

  qb.skip(
    (page - 1) * limit,
  );

  qb.take(limit);

  const [jobs, total] =
    await qb.getManyAndCount();

  return {
    data: jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit,
    ),
  };
}


// =====================================================
// PUBLIC - JOB DETAIL
// =====================================================

async findOne(id: string) {
  const job =
    await this.jobRepository.findOne({
      where: {
        id,
      },

      relations: {
        company: true,
        category: true,
      },
    });

  if (!job) {
    throw new NotFoundException(
      'Job not found',
    );
  }

  // ===================================================
  // DO NOT ALLOW SEEKERS TO SEE JOBS FROM
  // UNAPPROVED COMPANIES
  // ===================================================

  if (
    job.company.status !==
    CompanyStatus.APPROVED
  ) {
    throw new NotFoundException(
      'Job not found',
    );
  }

  // ===================================================
  // DO NOT SHOW CLOSED JOBS
  // ===================================================

  if (
    job.status === JobStatus.CLOSED
  ) {
    throw new NotFoundException(
      'Job not found',
    );
  }

  return job;
}


  async myJobs(user: any) {
  const company = await this.companyRepository.findOne({
    where: {
      user: {
        id: user.id,
      },
    },
  });

  if (!company) {
    throw new NotFoundException('Company profile not found');
  }

  return this.jobRepository.find({
    where: {
      company: {
        id: company.id,
      },
    },

    relations: {
      category: true,
      applications: true,
    },

    order: {
      createdAt: 'DESC',
    },
  });
}
 async update(
  id: string,
  dto: UpdateJobDto,
  user: any,
) {
  const job = await this.jobRepository.findOne({
    where: { id },
    relations: {
      company: {
        user: true,
      },
      category: true,
    },
  });

  if (!job) {
    throw new NotFoundException('Job not found');
  }

  // Make sure this job belongs to the logged-in company
  if (job.company.user.id !== user.id) {
    throw new ForbiddenException(
      'You are not allowed to update this job',
    );
  }

  // Update category if categoryId was provided
  if (dto.categoryId) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: dto.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    job.category = category;
  }

  // Don't put categoryId directly into Job
  const {
    categoryId,
    ...jobData
  } = dto;

  Object.assign(job, jobData);

  return this.jobRepository.save(job);
}

async getJobs(query: AdminJobQueryDto) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const qb = this.jobRepository
    .createQueryBuilder('job')
    .leftJoinAndSelect('job.company', 'company')
    .leftJoinAndSelect('job.category', 'category');

  // ADMIN JOB PAGE:
  // Only show published and closed jobs
  qb.andWhere('job.status IN (:...statuses)', {
    statuses: [
      JobStatus.PUBLISHED,
      JobStatus.CLOSED,
    ],
  });

  // Search
  if (query.search) {
    qb.andWhere(
      `(
        LOWER(job.title) LIKE LOWER(:search)
        OR LOWER(company.companyName) LIKE LOWER(:search)
        OR LOWER(job.location) LIKE LOWER(:search)
      )`,
      {
        search: `%${query.search}%`,
      },
    );
  }

  // Status filter
  if (query.status) {
    qb.andWhere('job.status = :status', {
      status: query.status,
    });
  }

  qb.orderBy('job.createdAt', 'DESC');

  qb.skip((page - 1) * limit);
  qb.take(limit);

  const [jobs, total] = await qb.getManyAndCount();

  return {
    data: jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
async remove(
 id:string,
 user:any
){

const job = await this.jobRepository.findOne({
  where: { id },
  relations: {
    company: {
      user: true,
    },
  },
});


if(!job){
 throw new NotFoundException();
}


if(job.company.user.id !== user.id){
 throw new ForbiddenException();
}


return this.jobRepository.remove(job);

}

async close(
  id: string,
  user: any,
) {
  const job = await this.jobRepository.findOne({
    where: {
      id,
    },
    relations: {
      company: {
        user: true,
      },
    },
  });

  if (!job) {
    throw new NotFoundException(
      'Job not found',
    );
  }

  // Make sure the job belongs to the logged-in company
  if (job.company.user.id !== user.id) {
    throw new ForbiddenException(
      'You are not allowed to close this job',
    );
  }

  // Already closed
  if (job.status === JobStatus.CLOSED) {
    return job;
  }

  job.status = JobStatus.CLOSED;

  return this.jobRepository.save(job);
}

}
