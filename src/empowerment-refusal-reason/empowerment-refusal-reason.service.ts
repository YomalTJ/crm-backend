import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpowermentRefusalReason } from './entities/empowerment-refusal-reason.entity';

@Injectable()
export class EmpowermentRefusalReasonService {
  constructor(
    @InjectRepository(EmpowermentRefusalReason)
    private readonly refusalReasonRepository: Repository<EmpowermentRefusalReason>,
  ) {}

  async findAll() {
    return this.refusalReasonRepository.find();
  }
}
