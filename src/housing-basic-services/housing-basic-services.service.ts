import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HousingBasicService } from './entities/housing-basic-service.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateHousingBasicServiceDto } from './dto/create-housing-basic-service.dto';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class HousingBasicServicesService {
  constructor(
    @InjectRepository(HousingBasicService)
    private housingBasicServiceRepo: Repository<HousingBasicService>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateHousingBasicServiceDto, staffId: string) {
    const staff = await this.housingBasicServiceRepo.manager.findOneByOrFail(
      Staff,
      {
        id: staffId,
      },
    );

    const service = this.housingBasicServiceRepo.create({
      ...dto,
      createdBy: staff,
    });

    const saved = await this.housingBasicServiceRepo.save(service);
    await this.auditService.log(
      'CREATE',
      'HousingBasicService',
      saved.housing_service_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.housingBasicServiceRepo.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }
}
