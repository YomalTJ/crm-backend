import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectTypeService } from './project-type.service';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';

@Controller('project-type')
export class ProjectTypeController {
  constructor(private readonly service: ProjectTypeService) {}

  @Post()
  create(@Body() dto: CreateProjectTypeDto, @Req() req: Request) {
    const staffId = req['user'].userId;
    return this.service.create(dto, staffId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('livelihood/:livelihoodId')
  findByLivelihood(@Param('livelihoodId', ParseIntPipe) livelihoodId: string) {
    return this.service.findByLivelihood(livelihoodId);
  }
}
