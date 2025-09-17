import { Test, TestingModule } from '@nestjs/testing';
import { SamurdhiSubsidyService } from './samurdhi-subsidy.service';

describe('SamurdhiSubsidyService', () => {
  let service: SamurdhiSubsidyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SamurdhiSubsidyService],
    }).compile();

    service = module.get<SamurdhiSubsidyService>(SamurdhiSubsidyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
