import { Test, TestingModule } from '@nestjs/testing';
import { DomesticDynamicsService } from './domestic-dynamics.service';

describe('DomesticDynamicsService', () => {
  let service: DomesticDynamicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomesticDynamicsService],
    }).compile();

    service = module.get<DomesticDynamicsService>(DomesticDynamicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
