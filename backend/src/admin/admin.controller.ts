import {
Controller,
Get,
Patch,
Param,
UseGuards,
} from '@nestjs/common';


import { AdminService } from './admin.service';


import { JwtAuthGuard } 
from '../common/guards/jwt-auth.guard';


import { RolesGuard } 
from '../common/guards/roles.guard';


import { Roles } 
from '../common/decorators/roles.decorator';



@Controller('admin')
export class AdminController {


constructor(
 private adminService:AdminService
){}

@Get('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
getCompanies() {
  return this.adminService.getCompanies();
}

@Get('companies/pending')
@UseGuards(
 JwtAuthGuard,
 RolesGuard
)
@Roles('ADMIN')
getPendingCompanies(){

return this.adminService.getPendingCompanies();

}


@Get('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
getJobs() {
  return this.adminService.getJobs();
}

@Patch('companies/:id/approve')
@UseGuards(
 JwtAuthGuard,
 RolesGuard
)
@Roles('ADMIN')
approveCompany(
@Param('id') id:string
){

return this.adminService.approveCompany(id);

}




@Patch('companies/:id/reject')
@UseGuards(
 JwtAuthGuard,
 RolesGuard
)
@Roles('ADMIN')
rejectCompany(
@Param('id') id:string
){

return this.adminService.rejectCompany(id);

}
 

@Get('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
getUsers() {
  return this.adminService.getUsers();
}

}