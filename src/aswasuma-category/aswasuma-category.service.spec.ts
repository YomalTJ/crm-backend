import { Test, TestingModule } from '@nestjs/testing';
import { AswasumaCategoryService } from './aswasuma-category.service';

describe('AswasumaCategoryService', () => {
  let service: AswasumaCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AswasumaCategoryService],
    }).compile();

    service = module.get<AswasumaCategoryService>(AswasumaCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
