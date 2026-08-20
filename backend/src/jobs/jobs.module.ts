import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Job } from './entities/job.entity';

import { JobsController } from './jobs.controller';

import { JobsService } from './jobs.service';
import { Company } from '../companies/entities/company.entity';
import { Category } from '../categories/entities/category.entity';
import { JobType } from '../job-types/entities/job-type.entity';


@Module({

imports:[
 TypeOrmModule.forFeature([
  Job,
  Company,
  Category,
  JobType,
 ])
],

controllers:[
 JobsController
],

providers:[
 JobsService
]

})
export class JobsModule {}