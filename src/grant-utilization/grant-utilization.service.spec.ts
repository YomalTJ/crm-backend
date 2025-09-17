import { Test, TestingModule } from '@nestjs/testing';
import { GrantUtilizationService } from './grant-utilization.service';

describe('GrantUtilizationService', () => {
  let service: GrantUtilizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrantUtilizationService],
    }).compile();

    service = module.get<GrantUtilizationService>(GrantUtilizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
