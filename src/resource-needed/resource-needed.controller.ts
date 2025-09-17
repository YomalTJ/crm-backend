import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ResourceNeededService } from './resource-needed.service';
import { CreateResourceNeededDto } from './dto/create-resource-needed.dto';

@Controller('resource-needed')
export class ResourceNeededController {
  constructor(private readonly service: ResourceNeededService) {}

  @Post()
  create(@Body() dto: CreateResourceNeededDto, @Req() req: Request) {
    const staffId = req['user'].userId;
    return this.service.create(dto, staffId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
