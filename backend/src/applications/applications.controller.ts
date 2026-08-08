import {
 Controller,
 Post,
 Body,
 UseGuards
} from '@nestjs/common';


import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Get, Param ,Patch} from '@nestjs/common';

import { ApplicationsService } from './applications.service';

import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';



@Controller('applications')
export class ApplicationsController {


constructor(
 private applicationsService: ApplicationsService
){}



@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('JOB_SEEKER')
create(
  @Body() dto: CreateApplicationDto,
  @CurrentUser() user:any,
) {
  console.log("CURRENT USER:", user);

  return this.applicationsService.create(
    dto,
    user
  );
}
@Get('job/:jobId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('COMPANY')
getJobApplicants(
  @Param('jobId') jobId:string,
  @CurrentUser() user:any,
){

  return this.applicationsService.getJobApplicants(
    jobId,
    user
  );

}
@Patch(':id/status')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('COMPANY')
updateStatus(
  @Param('id') id:string,

  @Body() dto:UpdateApplicationStatusDto,

  @CurrentUser() user:any,
){

return this.applicationsService.updateStatus(
  id,
  dto,
  user
);

}

}