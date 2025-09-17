import { Test, TestingModule } from '@nestjs/testing';
import { CommunityParticipationController } from './community-participation.controller';

describe('CommunityParticipationController', () => {
  let controller: CommunityParticipationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityParticipationController],
    }).compile();

    controller = module.get<CommunityParticipationController>(CommunityParticipationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
