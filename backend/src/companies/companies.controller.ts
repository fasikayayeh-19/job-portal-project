import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { CompaniesService } from './companies.service';

import { CreateCompanyDto } from './dto/create-company.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';

import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

 @Post()
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('COMPANY')
createCompany(
  @Body() dto: CreateCompanyDto,
  @CurrentUser() user:any,
) {

 return this.companiesService.create(
   dto,
   user,
 );

}
}
