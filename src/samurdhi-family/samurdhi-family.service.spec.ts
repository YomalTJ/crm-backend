import { Test, TestingModule } from '@nestjs/testing';
import { SamurdhiFamilyService } from './samurdhi-family.service';

describe('SamurdhiFamilyService', () => {
  let service: SamurdhiFamilyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SamurdhiFamilyService],
    }).compile();

    service = module.get<SamurdhiFamilyService>(SamurdhiFamilyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
