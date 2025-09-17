import { Test, TestingModule } from '@nestjs/testing';
import { LivelihoodsService } from './livelihoods.service';

describe('LivelihoodsService', () => {
  let service: LivelihoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LivelihoodsService],
    }).compile();

    service = module.get<LivelihoodsService>(LivelihoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
