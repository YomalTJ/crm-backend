import { Test, TestingModule } from '@nestjs/testing';
import { HouseholdCitizenController } from './household-citizen.controller';

describe('HouseholdCitizenController', () => {
  let controller: HouseholdCitizenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HouseholdCitizenController],
    }).compile();

    controller = module.get<HouseholdCitizenController>(HouseholdCitizenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
