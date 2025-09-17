import { Test, TestingModule } from '@nestjs/testing';
import { ResourceNeededController } from './resource-needed.controller';

describe('ResourceNeededController', () => {
  let controller: ResourceNeededController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceNeededController],
    }).compile();

    controller = module.get<ResourceNeededController>(ResourceNeededController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
