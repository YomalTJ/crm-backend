import { Test, TestingModule } from '@nestjs/testing';
import { BusinessEmpowermentService } from './business-empowerment.service';

describe('BusinessEmpowermentService', () => {
  let service: BusinessEmpowermentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessEmpowermentService],
    }).compile();

    service = module.get<BusinessEmpowermentService>(BusinessEmpowermentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
