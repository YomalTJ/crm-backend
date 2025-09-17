import { Body, Controller, Get, Post, Req, Query } from '@nestjs/common';
import { BeneficiaryStatusService } from './beneficiary-status.service';
import { CreateBeneficiaryStatusDto } from './dto/create-beneficiary-status.dto';

@Controller('beneficiary-status')
export class BeneficiaryStatusController {
  constructor(private readonly service: BeneficiaryStatusService) {}

  @Post()
  create(@Body() dto: CreateBeneficiaryStatusDto, @Req() req: Request) {
    const staffId = req['user'].userId;
    return this.service.create(dto, staffId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
