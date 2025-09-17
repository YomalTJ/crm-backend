import { Controller, Get } from '@nestjs/common';
import { DisabilityService } from './disability.service';
import { Disability } from './entities/disability.entity';

@Controller('disabilities')
export class DisabilityController {
  constructor(private readonly disabilityService: DisabilityService) {}

  @Get()
  async findAll(): Promise<Disability[]> {
    return this.disabilityService.findAll();
  }
}
