import { Body, Controller, Get, Post, Req, Query } from '@nestjs/common';
import { EmpowermentDimensionService } from './empowerment-dimension.service';
import { CreateEmpowermentDimensionDto } from './dto/create-empowerment-dimension.dto';

@Controller('empowerment-dimension')
export class EmpowermentDimensionController {
  constructor(private readonly service: EmpowermentDimensionService) {}

  @Post()
  create(@Body() dto: CreateEmpowermentDimensionDto, @Req() req: Request) {
    const staffId = req['user'].userId;
    return this.service.create(dto, staffId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
