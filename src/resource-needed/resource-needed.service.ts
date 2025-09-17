import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceNeeded } from './entities/resource-needed.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateResourceNeededDto } from './dto/create-resource-needed.dto';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class ResourceNeededService {
  constructor(
    @InjectRepository(ResourceNeeded)
    private resourceNeededRepo: Repository<ResourceNeeded>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateResourceNeededDto, staffId: string) {
    const staff = await this.resourceNeededRepo.manager.findOneByOrFail(Staff, {
      id: staffId,
    });

    const resource = this.resourceNeededRepo.create({
      ...dto,
      createdBy: staff,
    });

    const saved = await this.resourceNeededRepo.save(resource);
    await this.auditService.log(
      'CREATE',
      'ResourceNeeded',
      saved.resource_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.resourceNeededRepo.find({ relations: ['createdBy'] });
  }
}
