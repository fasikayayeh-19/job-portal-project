import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';

import { CompaniesService } from './companies.service';

import { CreateCompanyDto } from './dto/create-company.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';

import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
  ) {}


  @Get('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('COMPANY')
getDashboard(
  @CurrentUser() user: User,
) {
  return this.companiesService.getDashboard(
    user.id,
  );
}

  // =====================================================
  // CREATE COMPANY
  // =====================================================

  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('COMPANY')
  createCompany(
    @Body() dto: CreateCompanyDto,
    @CurrentUser() user: any,
  ) {
    return this.companiesService.create(
      dto,
      user,
    );
  }

  // =====================================================
  // GET MY COMPANY PROFILE
  // =====================================================

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getMyCompany(
    @CurrentUser() user: any,
  ) {
    return this.companiesService.getMyCompany(
      user.id,
    );
  }
  
}