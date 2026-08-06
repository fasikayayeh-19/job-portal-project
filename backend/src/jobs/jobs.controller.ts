import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';

import { JobsService } from './jobs.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobQueryDto } from './dto/job-query.dto';


@Controller('jobs')
export class JobsController {

constructor(
 private jobsService:JobsService
){}



@Post()
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('COMPANY')
createJob(
 @Body() dto:CreateJobDto,
 @CurrentUser() user:any
){

return this.jobsService.create(dto,user);

}


@Get()
findAll(
  @Query() query: JobQueryDto,
) {
  return this.jobsService.findAll(query);
}

@Get('my-jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('COMPANY')
myJobs(
  @CurrentUser() user: any,
) {
  return this.jobsService.myJobs(user);
}
@Get(':id')
findOne(
  @Param('id') id: string,
) {
  return this.jobsService.findOne(id);
}

@Patch(':id')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('COMPANY')
updateJob(
 @Param('id') id:string,
 @Body() dto:UpdateJobDto,
 @CurrentUser() user:any
){

return this.jobsService.update(
 id,
 dto,
 user
);

}



@Patch(':id/close')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('COMPANY')
closeJob(
 @Param('id') id:string,
 @CurrentUser() user:any
){

return this.jobsService.close(
 id,
 user
);

}



@Delete(':id')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('COMPANY')
deleteJob(
 @Param('id') id:string,
 @CurrentUser() user:any
){

return this.jobsService.remove(
 id,
 user
);

}

}