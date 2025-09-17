import { Body, Controller, Get, Post, Req, Query } from '@nestjs/common';
import { DomesticDynamicsService } from './domestic-dynamics.service';
import { CreateDomesticDynamicDto } from './dto/create-domestic-dynamic.dto';

@Controller('domestic-dynamics')
export class DomesticDynamicsController {
  constructor(private readonly service: DomesticDynamicsService) {}

  @Post()
  create(@Body() dto: CreateDomesticDynamicDto, @Req() req: Request) {
    const staffId = req['user'].userId;
    return this.service.create(dto, staffId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
