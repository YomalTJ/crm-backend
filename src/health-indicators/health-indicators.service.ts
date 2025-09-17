import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HealthIndicator } from './entities/health-indicator.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateHealthIndicatorDto } from './dto/create-health-indicator.dto';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class HealthIndicatorsService {
  constructor(
    @InjectRepository(HealthIndicator)
    private healthIndicatorRepo: Repository<HealthIndicator>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateHealthIndicatorDto, staffId: string) {
    const staff = await this.healthIndicatorRepo.manager.findOneByOrFail(
      Staff,
      {
        id: staffId,
      },
    );

    const indicator = this.healthIndicatorRepo.create({
      ...dto,
      createdBy: staff,
    });

    const saved = await this.healthIndicatorRepo.save(indicator);
    await this.auditService.log(
      'CREATE',
      'HealthIndicator',
      saved.health_indicator_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.healthIndicatorRepo.find({ relations: ['createdBy'] });
  }
}
