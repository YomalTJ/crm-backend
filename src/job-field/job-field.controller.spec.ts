import { Test, TestingModule } from '@nestjs/testing';
import { JobFieldController } from './job-field.controller';

describe('JobFieldController', () => {
  let controller: JobFieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobFieldController],
    }).compile();

    controller = module.get<JobFieldController>(JobFieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
