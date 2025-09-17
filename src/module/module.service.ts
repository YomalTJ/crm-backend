import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemModules } from './entities/module.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(SystemModules)
    private moduleRepo: Repository<SystemModules>,
  ) {}

  create(name: string) {
    const mod = this.moduleRepo.create({ name });
    return this.moduleRepo.save(mod);
  }

  findAll() {
    return this.moduleRepo.find();
  }

  async findOne(id: string) {
    const mod = await this.moduleRepo.findOneBy({ id });
    if (!mod) throw new NotFoundException('Module not found');
    return mod;
  }

  async update(id: string, name: string) {
    const mod = await this.findOne(id);
    mod.name = name;
    return this.moduleRepo.save(mod);
  }

  async remove(id: string) {
    const mod = await this.findOne(id);
    return this.moduleRepo.remove(mod);
  }
}
