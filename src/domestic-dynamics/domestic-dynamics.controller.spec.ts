import { Test, TestingModule } from '@nestjs/testing';
import { DomesticDynamicsController } from './domestic-dynamics.controller';

describe('DomesticDynamicsController', () => {
  let controller: DomesticDynamicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DomesticDynamicsController],
    }).compile();

    controller = module.get<DomesticDynamicsController>(DomesticDynamicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
