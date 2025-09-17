import { Test, TestingModule } from '@nestjs/testing';
import { CommunityParticipationService } from './community-participation.service';

describe('CommunityParticipationService', () => {
  let service: CommunityParticipationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityParticipationService],
    }).compile();

    service = module.get<CommunityParticipationService>(CommunityParticipationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
