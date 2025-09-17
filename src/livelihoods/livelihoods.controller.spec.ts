import { Test, TestingModule } from '@nestjs/testing';
import { LivelihoodsController } from './livelihoods.controller';

describe('LivelihoodsController', () => {
  let controller: LivelihoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LivelihoodsController],
    }).compile();

    controller = module.get<LivelihoodsController>(LivelihoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
