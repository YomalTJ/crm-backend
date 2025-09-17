import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { JobFieldService } from './job-field.service';
import { CreateJobFieldDto } from './dto/create-job-field.dto';

@Controller('job-field')
export class JobFieldController {
  constructor(private readonly service: JobFieldService) {}

  @Post()
  create(@Body() dto: CreateJobFieldDto, @Req() req: Request) {
    const staffId = req['user'].userId;
    return this.service.create(dto, staffId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
