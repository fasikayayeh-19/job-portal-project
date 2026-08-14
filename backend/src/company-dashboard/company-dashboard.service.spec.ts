import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDashboardService } from './company-dashboard.service';

describe('CompanyDashboardService', () => {
  let service: CompanyDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyDashboardService],
    }).compile();

    service = module.get<CompanyDashboardService>(CompanyDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
