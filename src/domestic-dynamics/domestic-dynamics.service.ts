import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DomesticDynamic } from './entities/domestic-dynamic.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateDomesticDynamicDto } from './dto/create-domestic-dynamic.dto';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class DomesticDynamicsService {
  constructor(
    @InjectRepository(DomesticDynamic)
    private domesticDynamicRepo: Repository<DomesticDynamic>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateDomesticDynamicDto, staffId: string) {
    const staff = await this.domesticDynamicRepo.manager.findOneByOrFail(
      Staff,
      {
        id: staffId,
      },
    );

    const dynamic = this.domesticDynamicRepo.create({
      ...dto,
      createdBy: staff,
    });

    const saved = await this.domesticDynamicRepo.save(dynamic);
    await this.auditService.log(
      'CREATE',
      'DomesticDynamic',
      saved.domestic_dynamic_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.domesticDynamicRepo.find({
      relations: ['createdBy'],
    });
  }
}
