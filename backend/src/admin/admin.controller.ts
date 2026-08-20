import { Controller,Delete,Query, Get, Patch, Param, UseGuards,Req } from '@nestjs/common';

import { AdminService } from './admin.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyStatus } from '../companies/enums/company-status.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/enums/user-role.enum';
import { UserStatus } from '../users/enums/user-status.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminJobQueryDto, AdminJobStatus } from '../jobs/dto/admin-job-query.dto';
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
@Get('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
getCompanies(
  @Query('page') page = '1',
  @Query('limit') limit = '10',
  @Query('status') status?: CompanyStatus,
  @Query('search') search?: string,
) {
  return this.adminService.getCompanies(
    Number(page),
    Number(limit),
    status,
    search,
  );
}


@Patch('companies/:id/suspend')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
suspendCompany(@Param('id') id: string) {
  return this.adminService.suspendCompany(id);
}

@Patch('companies/:id/activate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
activateCompany(@Param('id') id: string) {
  return this.adminService.activateCompany(id);
}

  @Get('companies/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getPendingCompanies() {
    return this.adminService.getPendingCompanies();
  }

  @Get('jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getJobs(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('status') status?: AdminJobStatus,
  ) {
    return this.adminService.getJobs(
      Number(page),
      Number(limit),
      search,
      status,
    );
  }
  @Get('applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getApplications() {
    return this.adminService.getApplications();
  }
  @Patch('companies/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  approveCompany(@Param('id') id: string) {
    return this.adminService.approveCompany(id);
  }

  @Patch('companies/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  rejectCompany(@Param('id') id: string) {
    return this.adminService.rejectCompany(id);
  }

  @Patch('users/:id/block')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
blockUser(@Param('id') id: string) {
  return this.adminService.blockUser(id);
}

@Patch('users/:id/unblock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
unblockUser(@Param('id') id: string) {
  return this.adminService.unblockUser(id);
}

@Get('users')
async getUsers(
  @Query('page') page = '1',
  @Query('limit') limit = '10',
  @Query('role') role?: UserRole,
  @Query('status') status?: UserStatus,
) {
  return this.adminService.getUsers(
    Number(page),
    Number(limit),
    role,
    status,
  );
}



  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

@Delete('users/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
deleteUser(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.adminService.deleteUser(
    id,
    req.user.id,
  );
}

@Delete('companies/:userId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
deleteCompanyAccount(
  @Param('userId') userId: string,
) {
  return this.adminService.deleteCompanyAccount(userId);
}
}
