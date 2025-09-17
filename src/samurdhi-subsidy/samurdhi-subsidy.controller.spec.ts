import { Test, TestingModule } from '@nestjs/testing';
import { SamurdhiSubsidyController } from './samurdhi-subsidy.controller';

describe('SamurdhiSubsidyController', () => {
  let controller: SamurdhiSubsidyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SamurdhiSubsidyController],
    }).compile();

    controller = module.get<SamurdhiSubsidyController>(SamurdhiSubsidyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
