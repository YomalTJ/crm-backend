import { Body, Controller, Get, Post, Req, Query } from '@nestjs/common';
import { HealthIndicatorsService } from './health-indicators.service';
import { CreateHealthIndicatorDto } from './dto/create-health-indicator.dto';

@Controller('health-indicators')
export class HealthIndicatorsController {
  constructor(private readonly service: HealthIndicatorsService) {}

  @Post()
  create(@Body() dto: CreateHealthIndicatorDto, @Req() req: Request) {
    const staffId = req['user'].userId;
    return this.service.create(dto, staffId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
