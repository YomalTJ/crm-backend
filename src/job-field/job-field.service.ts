import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobField } from './entities/job-field.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateJobFieldDto } from './dto/create-job-field.dto';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class JobFieldService {
  constructor(
    @InjectRepository(JobField)
    private jobFieldRepo: Repository<JobField>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateJobFieldDto, staffId: string) {
    const staff = await this.jobFieldRepo.manager.findOneByOrFail(Staff, {
      id: staffId,
    });

    const jobField = this.jobFieldRepo.create({
      ...dto,
      createdBy: staff,
    });

    const saved = await this.jobFieldRepo.save(jobField);
    await this.auditService.log(
      'CREATE',
      'JobField',
      saved.job_field_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.jobFieldRepo.find({ relations: ['createdBy'] });
  }
}
