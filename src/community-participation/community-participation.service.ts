import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityParticipation } from './entities/community-participation.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateCommunityParticipationDto } from './dto/create-community-participation.dto';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class CommunityParticipationService {
  constructor(
    @InjectRepository(CommunityParticipation)
    private communityParticipationRepo: Repository<CommunityParticipation>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateCommunityParticipationDto, staffId: string) {
    const staff = await this.communityParticipationRepo.manager.findOneByOrFail(
      Staff,
      {
        id: staffId,
      },
    );

    const participation = this.communityParticipationRepo.create({
      ...dto,
      createdBy: staff,
    });

    const saved = await this.communityParticipationRepo.save(participation);
    await this.auditService.log(
      'CREATE',
      'CommunityParticipation',
      saved.community_participation_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.communityParticipationRepo.find({
      relations: ['createdBy'],
    });
  }
}
