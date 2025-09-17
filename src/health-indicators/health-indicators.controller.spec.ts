import { Test, TestingModule } from '@nestjs/testing';
import { HealthIndicatorsController } from './health-indicators.controller';

describe('HealthIndicatorsController', () => {
  let controller: HealthIndicatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthIndicatorsController],
    }).compile();

    controller = module.get<HealthIndicatorsController>(HealthIndicatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
