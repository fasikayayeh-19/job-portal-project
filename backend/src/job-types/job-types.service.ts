import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JobType } from './entities/job-type.entity';
import { CreateJobTypeDto } from './dto/create-jobtype.dto';
import { UpdateJobTypeDto } from './dto/update-jobtype.dto';

@Injectable()
export class JobTypesService {
  constructor(
    @InjectRepository(JobType)
    private readonly jobTypeRepository: Repository<JobType>,
  ) {}

  async create(dto: CreateJobTypeDto) {
    const existing = await this.jobTypeRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Job type already exists',
      );
    }

    const jobType =
      this.jobTypeRepository.create(dto);

    return this.jobTypeRepository.save(jobType);
  }

  async findAll() {
    return this.jobTypeRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    const jobType =
      await this.jobTypeRepository.findOne({
        where: { id },
      });

    if (!jobType) {
      throw new NotFoundException(
        'Job type not found',
      );
    }

    return jobType;
  }

  async update(
    id: string,
    dto: UpdateJobTypeDto,
  ) {
    const jobType = await this.findOne(id);

    Object.assign(jobType, dto);

    return this.jobTypeRepository.save(jobType);
  }

  async remove(id: string) {
    const jobType = await this.findOne(id);

    await this.jobTypeRepository.remove(jobType);

    return {
      message: 'Job type deleted successfully',
    };
  }
}