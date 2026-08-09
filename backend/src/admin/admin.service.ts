import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Company } from '../companies/entities/company.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { CompanyStatus } from '../companies/enums/company-status.enum';
import { User } from '../users/entities/user.entity';

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
}
