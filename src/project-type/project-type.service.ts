import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectType } from './entities/project-type.entity';
import { Repository } from 'typeorm';
import { AuditService } from 'src/audit/audit.service';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { Staff } from 'src/staff/entities/staff.entity';
import { Livelihood } from 'src/livelihoods/entities/livelihood.entity';

@Injectable()
export class ProjectTypeService {
  constructor(
    @InjectRepository(ProjectType)
    private projectTypeRepo: Repository<ProjectType>,
    @InjectRepository(Livelihood)
    private livelihoodRepo: Repository<Livelihood>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateProjectTypeDto, staffId: string) {
    // Find staff
    const staff = await this.projectTypeRepo.manager.findOneByOrFail(Staff, {
      id: staffId,
    });

    // Find livelihood
    const livelihood = await this.livelihoodRepo.findOne({
      where: { id: parseInt(dto.livelihoodId) },
    });

    if (!livelihood) {
      throw new NotFoundException(
        `Livelihood with ID ${dto.livelihoodId} not found`,
      );
    }

    const projectType = this.projectTypeRepo.create({
      nameEnglish: dto.nameEnglish,
      nameSinhala: dto.nameSinhala,
      nameTamil: dto.nameTamil,
      createdBy: staff,
      livelihood: livelihood,
    });

    const saved = await this.projectTypeRepo.save(projectType);
    await this.auditService.log(
      'CREATE',
      'ProjectType',
      saved.project_type_id,
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findAll() {
    return this.projectTypeRepo.find({
      relations: ['createdBy', 'livelihood'],
    });
  }

  async findByLivelihood(livelihoodId: string) {
    return this.projectTypeRepo.find({
      where: { livelihood: { id: parseInt(livelihoodId) } },
      relations: ['createdBy', 'livelihood'],
    });
  }
}
