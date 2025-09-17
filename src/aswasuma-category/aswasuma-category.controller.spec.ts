import { Test, TestingModule } from '@nestjs/testing';
import { AswasumaCategoryController } from './aswasuma-category.controller';

describe('AswasumaCategoryController', () => {
  let controller: AswasumaCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AswasumaCategoryController],
    }).compile();

    controller = module.get<AswasumaCategoryController>(AswasumaCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
