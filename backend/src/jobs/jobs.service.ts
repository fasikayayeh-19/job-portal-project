import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Job, JobStatus } from './entities/job.entity';

import { Company } from '../companies/entities/company.entity';

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

  async findAll(query: JobQueryDto) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const qb = this.jobRepository
    .createQueryBuilder('job')
    .leftJoinAndSelect('job.company', 'company')
    .leftJoinAndSelect('job.category', 'category');

  // Only show jobs from approved companies
  qb.andWhere('company.status = :companyStatus', {
    companyStatus: CompanyStatus.APPROVED,
  });

  // Don't show closed jobs
  qb.andWhere('job.status != :jobStatus', {
    jobStatus: JobStatus.CLOSED,
  });

  if (query.search) {
    qb.andWhere('LOWER(job.title) LIKE LOWER(:search)', {
      search: `%${query.search}%`,
    });
  }

  if (query.location) {
    qb.andWhere('LOWER(job.location) LIKE LOWER(:location)', {
      location: `%${query.location}%`,
    });
  }

  if (query.jobType) {
    qb.andWhere('job.jobType = :jobType', {
      jobType: query.jobType,
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

  async findOne(id: string) {
    const job = await this.jobRepository.findOne({
      where: {
        id,
      },

      relations: {
        company: true,
        category: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
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

    return this.jobRepository.find({
      where: {
        company: {
          id: company!.id,
        },
      },

      relations: {
        category: true,
      },
    });
  }
  async update(
 id:string,
 dto:UpdateJobDto,
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
 throw new NotFoundException('Job not found');
}


if(job.company.user.id !== user.id){
 throw new ForbiddenException();
}


Object.assign(job,dto);


return this.jobRepository.save(job);

}
async close(
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


job.status = JobStatus.CLOSED;


return this.jobRepository.save(job);

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

}
