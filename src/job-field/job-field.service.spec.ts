import { Test, TestingModule } from '@nestjs/testing';
import { JobFieldService } from './job-field.service';

describe('JobFieldService', () => {
  let service: JobFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobFieldService],
    }).compile();

    service = module.get<JobFieldService>(JobFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
