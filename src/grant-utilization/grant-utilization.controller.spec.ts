import { Test, TestingModule } from '@nestjs/testing';
import { GrantUtilizationController } from './grant-utilization.controller';

describe('GrantUtilizationController', () => {
  let controller: GrantUtilizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrantUtilizationController],
    }).compile();

    controller = module.get<GrantUtilizationController>(GrantUtilizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
