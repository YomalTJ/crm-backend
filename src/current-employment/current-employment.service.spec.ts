import { Test, TestingModule } from '@nestjs/testing';
import { CurrentEmploymentService } from './current-employment.service';

describe('CurrentEmploymentService', () => {
  let service: CurrentEmploymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrentEmploymentService],
    }).compile();

    service = module.get<CurrentEmploymentService>(CurrentEmploymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
