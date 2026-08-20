import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { JobTypesService } from './job-types.service';

import { CreateJobTypeDto } from './dto/create-jobtype.dto';
import { UpdateJobTypeDto } from './dto/update-jobtype.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('job-types')
export class JobTypesController {
  constructor(
    private readonly jobTypesService: JobTypesService,
  ) {}

  // ===============================
  // GET ALL
  // ===============================

  @Get()
  findAll() {
    return this.jobTypesService.findAll();
  }

  // ===============================
  // GET ONE
  // ===============================

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.jobTypesService.findOne(id);
  }

  // ===============================
  // CREATE - ADMIN
  // ===============================

  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  create(
    @Body() dto: CreateJobTypeDto,
  ) {
    return this.jobTypesService.create(dto);
  }

  // ===============================
  // UPDATE - ADMIN
  // ===============================

  @Patch(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateJobTypeDto,
  ) {
    return this.jobTypesService.update(
      id,
      dto,
    );
  }

  // ===============================
  // DELETE - ADMIN
  // ===============================

  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  remove(
    @Param('id') id: string,
  ) {
    return this.jobTypesService.remove(id);
  }
}