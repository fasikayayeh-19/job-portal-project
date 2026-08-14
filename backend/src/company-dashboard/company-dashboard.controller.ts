import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { CompanyDashboardService } from './company-dashboard.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('company-dashboard')
@UseGuards(JwtAuthGuard)
export class CompanyDashboardController {
  constructor(
    private readonly companyDashboardService: CompanyDashboardService,
  ) {}

  @Get()
  getDashboard(
    @CurrentUser() user: any,
  ) {
    return this.companyDashboardService.getDashboard(
      user.id,
    );
  }
}