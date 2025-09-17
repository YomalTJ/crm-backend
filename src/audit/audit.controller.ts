import { Controller, Get } from '@nestjs/common';
import { AuditService } from './audit.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from 'src/staff/entities/staff.entity';
import { AuditLog } from './entities/audit-log.entity';
import { Repository } from 'typeorm';

@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,

    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,

    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  @Get()
  async getAllAudits() {
    const audits = await this.auditRepo.find({
      order: { performedAt: 'DESC' },
    });

    const result = await Promise.all(
      audits.map(async (log) => {
        const staff = await this.staffRepo.findOne({
          where: { id: log.performedBy },
          relations: ['role'],
        });

        return {
          ...log,
          performedByName: staff?.name || 'Unknown',
          performedByRole: staff?.role?.name || 'Unknown',
        };
      }),
    );

    return result;
  }
}
