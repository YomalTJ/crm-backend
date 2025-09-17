import { Test, TestingModule } from '@nestjs/testing';
import { HousingBasicServicesController } from './housing-basic-services.controller';

describe('HousingBasicServicesController', () => {
  let controller: HousingBasicServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HousingBasicServicesController],
    }).compile();

    controller = module.get<HousingBasicServicesController>(HousingBasicServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
