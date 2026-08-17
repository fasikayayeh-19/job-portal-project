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


}