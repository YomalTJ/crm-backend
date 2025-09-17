import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiaryStatusService } from './beneficiary-status.service';

describe('BeneficiaryStatusService', () => {
  let service: BeneficiaryStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeneficiaryStatusService],
    }).compile();

    service = module.get<BeneficiaryStatusService>(BeneficiaryStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
