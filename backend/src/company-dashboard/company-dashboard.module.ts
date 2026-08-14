import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyDashboardController } from './company-dashboard.controller';
import { CompanyDashboardService } from './company-dashboard.service';

import { Company } from '../companies/entities/company.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Job,
      Application,
    ]),
  ],

  controllers: [
    CompanyDashboardController,
  ],

  providers: [
    CompanyDashboardService,
  ],
})
export class CompanyDashboardModule {}