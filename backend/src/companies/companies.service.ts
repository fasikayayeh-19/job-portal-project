import { Injectable } from '@nestjs/common';
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
}