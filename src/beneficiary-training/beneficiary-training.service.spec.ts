import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiaryTrainingService } from './beneficiary-training.service';

describe('BeneficiaryTrainingService', () => {
  let service: BeneficiaryTrainingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeneficiaryTrainingService],
    }).compile();

    service = module.get<BeneficiaryTrainingService>(BeneficiaryTrainingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
