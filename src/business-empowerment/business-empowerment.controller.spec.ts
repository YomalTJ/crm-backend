import { Test, TestingModule } from '@nestjs/testing';
import { BusinessEmpowermentController } from './business-empowerment.controller';

describe('BusinessEmpowermentController', () => {
  let controller: BusinessEmpowermentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessEmpowermentController],
    }).compile();

    controller = module.get<BusinessEmpowermentController>(BusinessEmpowermentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
