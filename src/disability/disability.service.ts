import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disability } from './entities/disability.entity';

@Injectable()
export class DisabilityService {
  constructor(
    @InjectRepository(Disability)
    private readonly disabilityRepository: Repository<Disability>,
  ) {}

  async findAll() {
    return this.disabilityRepository.find();
  }
}
