import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CompanyStatus } from './enums/company-status.enum';

import { Company } from './entities/company.entity';

import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(dto: CreateCompanyDto, user: any) {
    const company = this.companyRepository.create({
      ...dto,

      user,

      status: CompanyStatus.PENDING,
    });

    return this.companyRepository.save(company);
  }
}
