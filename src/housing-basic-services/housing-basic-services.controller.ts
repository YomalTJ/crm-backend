import { Body, Controller, Get, Post, Req, Query } from '@nestjs/common';
import { HousingBasicServicesService } from './housing-basic-services.service';
import { CreateHousingBasicServiceDto } from './dto/create-housing-basic-service.dto';

@Controller('housing-basic-services')
export class HousingBasicServicesController {
  constructor(private readonly service: HousingBasicServicesService) {}

  @Post()
  create(@Body() dto: CreateHousingBasicServiceDto, @Req() req: Request) {
    const staffId = req['user'].userId;
    return this.service.create(dto, staffId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
