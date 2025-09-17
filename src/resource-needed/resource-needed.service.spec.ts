import { Test, TestingModule } from '@nestjs/testing';
import { ResourceNeededService } from './resource-needed.service';

describe('ResourceNeededService', () => {
  let service: ResourceNeededService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceNeededService],
    }).compile();

    service = module.get<ResourceNeededService>(ResourceNeededService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
