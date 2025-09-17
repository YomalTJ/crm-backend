import { Test, TestingModule } from '@nestjs/testing';
import { EmpowermentDimensionController } from './empowerment-dimension.controller';

describe('EmpowermentDimensionController', () => {
  let controller: EmpowermentDimensionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpowermentDimensionController],
    }).compile();

    controller = module.get<EmpowermentDimensionController>(EmpowermentDimensionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
