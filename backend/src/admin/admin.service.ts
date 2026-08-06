import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Company } from '../companies/entities/company.entity';

import { CompanyStatus } from '../companies/enums/company-status.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

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
}
