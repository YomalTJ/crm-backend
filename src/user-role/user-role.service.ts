import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { Repository } from 'typeorm';
import { SystemModules } from 'src/module/entities/module.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private roleRepo: Repository<UserRole>,
    @InjectRepository(SystemModules)
    private moduleRepo: Repository<SystemModules>,
  ) {}

  async create(dto: any) {
    const module = await this.moduleRepo.findOneBy({ id: dto.moduleId });
    if (!module) throw new NotFoundException('Module not found');

    const role = this.roleRepo.create({
      name: dto.name,
      canAdd: dto.canAdd,
      canUpdate: dto.canUpdate,
      canDelete: dto.canDelete,
      module,
    });

    return this.roleRepo.save(role);
  }

  findAll() {
    return this.roleRepo.find();
  }

  async findOne(id: string) {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: string, dto: any) {
    const role = await this.findOne(id);
    if (dto.name) role.name = dto.name;
    if (dto.moduleId) {
      const module = await this.moduleRepo.findOneBy({ id: dto.moduleId });
      if (!module) throw new NotFoundException('Module not found');
      role.module = module;
    }
    role.canAdd = dto.canAdd;
    role.canUpdate = dto.canUpdate;
    role.canDelete = dto.canDelete;

    return this.roleRepo.save(role);
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    return this.roleRepo.remove(role);
  }
}
