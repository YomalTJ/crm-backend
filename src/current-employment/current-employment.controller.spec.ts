import { Test, TestingModule } from '@nestjs/testing';
import { CurrentEmploymentController } from './current-employment.controller';

describe('CurrentEmploymentController', () => {
  let controller: CurrentEmploymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrentEmploymentController],
    }).compile();

    controller = module.get<CurrentEmploymentController>(CurrentEmploymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
