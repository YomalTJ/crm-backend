import { Test, TestingModule } from '@nestjs/testing';
import { SamurdhiFamilyController } from './samurdhi-family.controller';

describe('SamurdhiFamilyController', () => {
  let controller: SamurdhiFamilyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SamurdhiFamilyController],
    }).compile();

    controller = module.get<SamurdhiFamilyController>(SamurdhiFamilyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
