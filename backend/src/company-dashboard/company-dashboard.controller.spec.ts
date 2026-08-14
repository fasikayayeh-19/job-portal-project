import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDashboardController } from './company-dashboard.controller';

describe('CompanyDashboardController', () => {
  let controller: CompanyDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyDashboardController],
    }).compile();

    controller = module.get<CompanyDashboardController>(CompanyDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
