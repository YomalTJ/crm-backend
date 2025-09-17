import { Test, TestingModule } from '@nestjs/testing';
import { EmpowermentDimensionService } from './empowerment-dimension.service';

describe('EmpowermentDimensionService', () => {
  let service: EmpowermentDimensionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpowermentDimensionService],
    }).compile();

    service = module.get<EmpowermentDimensionService>(EmpowermentDimensionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
