import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AswasumaCategory } from './entities/aswasuma-category.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateAswasumaCategoryDto } from './dto/create-aswasuma-category.dto';
import { Staff } from 'src/staff/entities/staff.entity';

@Injectable()
export class AswasumaCategoryService {
  constructor(
    @InjectRepository(AswasumaCategory)
    private categoryRepo: Repository<AswasumaCategory>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateAswasumaCategoryDto, staffId: string) {
    const staff = await this.categoryRepo.manager.findOneByOrFail(Staff, {
      id: staffId,
    });

    const category = this.categoryRepo.create({
      ...dto,
      createdBy: staff,
    });

    const saved = await this.categoryRepo.save(category);
    await this.auditService.log(
      'CREATE',
      'AswasumaCategory',
      saved.aswesuma_cat_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.categoryRepo.find({ relations: ['createdBy'] });
  }
}
