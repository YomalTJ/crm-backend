import { Test, TestingModule } from '@nestjs/testing';
import { HouseholdCitizenService } from './household-citizen.service';

describe('HouseholdCitizenService', () => {
  let service: HouseholdCitizenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HouseholdCitizenService],
    }).compile();

    service = module.get<HouseholdCitizenService>(HouseholdCitizenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
