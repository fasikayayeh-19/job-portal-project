import { Injectable, ForbiddenException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Job } from './entities/job.entity';

import { Company } from '../companies/entities/company.entity';

import { CreateJobDto } from './dto/create-job.dto';

import { CompanyStatus } from '../companies/enums/company-status.enum';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,

    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(
    dto: CreateJobDto,

    user: any,
  ) {
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
    });

    return this.jobRepository.save(job);
  }
}
