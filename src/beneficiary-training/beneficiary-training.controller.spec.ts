import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiaryTrainingController } from './beneficiary-training.controller';

describe('BeneficiaryTrainingController', () => {
  let controller: BeneficiaryTrainingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeneficiaryTrainingController],
    }).compile();

    controller = module.get<BeneficiaryTrainingController>(BeneficiaryTrainingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
