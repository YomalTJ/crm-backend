import { Controller, Get } from '@nestjs/common';
import { EmpowermentRefusalReasonService } from './empowerment-refusal-reason.service';
import { EmpowermentRefusalReason } from './entities/empowerment-refusal-reason.entity';

@Controller('empowerment-refusal-reasons')
export class EmpowermentRefusalReasonController {
  constructor(
    private readonly refusalReasonService: EmpowermentRefusalReasonService,
  ) {}

  @Get()
  async findAll(): Promise<EmpowermentRefusalReason[]> {
    return this.refusalReasonService.findAll();
  }
}
