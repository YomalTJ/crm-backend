import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BeneficiaryStatus } from './entities/beneficiary-status.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateBeneficiaryStatusDto } from './dto/create-beneficiary-status.dto';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class BeneficiaryStatusService {
  constructor(
    @InjectRepository(BeneficiaryStatus)
    private beneficiaryStatusRepo: Repository<BeneficiaryStatus>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateBeneficiaryStatusDto, staffId: string) {
    const staff = await this.beneficiaryStatusRepo.manager.findOneByOrFail(
      Staff,
      {
        id: staffId,
      },
    );

    const status = this.beneficiaryStatusRepo.create({
      ...dto,
      createdBy: staff,
    });

    const saved = await this.beneficiaryStatusRepo.save(status);
    await this.auditService.log(
      'CREATE',
      'BeneficiaryStatus',
      saved.beneficiary_type_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.beneficiaryStatusRepo.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }
}
