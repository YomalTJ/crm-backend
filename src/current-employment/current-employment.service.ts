import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentEmployment } from './entities/current-employment.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateCurrentEmploymentDto } from './dto/create-current-employment.dto';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class CurrentEmploymentService {
  constructor(
    @InjectRepository(CurrentEmployment)
    private employmentRepo: Repository<CurrentEmployment>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateCurrentEmploymentDto, staffId: string) {
    const staff = await this.employmentRepo.manager.findOneByOrFail(Staff, {
      id: staffId,
    });

    const employment = this.employmentRepo.create({
      ...dto,
      createdBy: staff,
    });

    const saved = await this.employmentRepo.save(employment);
    await this.auditService.log(
      'CREATE',
      'CurrentEmployment',
      saved.employment_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.employmentRepo.find({ relations: ['createdBy'] });
  }
}
