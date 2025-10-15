import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
  ParseIntPipe,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ProjectTypeService } from './project-type.service';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('project-type')
export class ProjectTypeController {
  constructor(private readonly service: ProjectTypeService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', ['National Level User'])
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
