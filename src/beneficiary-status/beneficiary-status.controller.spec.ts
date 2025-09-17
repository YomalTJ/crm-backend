import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiaryStatusController } from './beneficiary-status.controller';

describe('BeneficiaryStatusController', () => {
  let controller: BeneficiaryStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeneficiaryStatusController],
    }).compile();

    controller = module.get<BeneficiaryStatusController>(BeneficiaryStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
