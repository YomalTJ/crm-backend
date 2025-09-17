import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SamurdhiSubsisdy } from './entities/samurdhi-subsidy.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateSamurdhiSubsidyDto } from './dto/create-samurdhi-subsidy.entity';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class SamurdhiSubsidyService {
  constructor(
    @InjectRepository(SamurdhiSubsisdy)
    private samurdhiSubsisdyRepo: Repository<SamurdhiSubsisdy>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateSamurdhiSubsidyDto, staffId: string) {
    const staff = await this.samurdhiSubsisdyRepo.manager.findOneByOrFail(
      Staff,
      {
        id: staffId,
      },
    );

    const employment = this.samurdhiSubsisdyRepo.create({
      ...dto,
      createdBy: staff,
    });

    const saved = await this.samurdhiSubsisdyRepo.save(employment);
    await this.auditService.log(
      'CREATE',
      'SamurdhiSubsidy',
      saved.subsisdy_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.samurdhiSubsisdyRepo.find({ relations: ['createdBy'] });
  }
}
