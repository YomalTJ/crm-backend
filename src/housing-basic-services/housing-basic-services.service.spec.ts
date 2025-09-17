import { Test, TestingModule } from '@nestjs/testing';
import { HousingBasicServicesService } from './housing-basic-services.service';

describe('HousingBasicServicesService', () => {
  let service: HousingBasicServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HousingBasicServicesService],
    }).compile();

    service = module.get<HousingBasicServicesService>(HousingBasicServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
