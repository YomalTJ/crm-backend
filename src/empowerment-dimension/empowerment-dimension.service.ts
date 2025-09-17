import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpowermentDimension } from './entities/empowerment-dimension.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateEmpowermentDimensionDto } from './dto/create-empowerment-dimension.dto';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class EmpowermentDimensionService {
  constructor(
    @InjectRepository(EmpowermentDimension)
    private empowermentDimensionRepo: Repository<EmpowermentDimension>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateEmpowermentDimensionDto, staffId: string) {
    const staff = await this.empowermentDimensionRepo.manager.findOneByOrFail(
      Staff,
      {
        id: staffId,
      },
    );

    const dimension = this.empowermentDimensionRepo.create({
      ...dto,
      createdBy: staff,
    });

    const saved = await this.empowermentDimensionRepo.save(dimension);
    await this.auditService.log(
      'CREATE',
      'EmpowermentDimension',
      saved.empowerment_dimension_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.empowermentDimensionRepo.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }
}
