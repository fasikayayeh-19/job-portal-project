import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HomeController } from './home.controller';
import { HomeService } from './home.service';

import { Job } from '../jobs/entities/job.entity';
import { Category } from '../categories/entities/category.entity';
import { Company } from '../companies/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      Category,
      Company,
    ]),
  ],

  controllers: [
    HomeController,
  ],

  providers: [
    HomeService,
  ],
})
export class HomeModule {}