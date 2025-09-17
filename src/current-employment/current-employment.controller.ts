import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CurrentEmploymentService } from './current-employment.service';
import { CreateCurrentEmploymentDto } from './dto/create-current-employment.dto';

@Controller('current-employment')
export class CurrentEmploymentController {
  constructor(private service: CurrentEmploymentService) {}

  @Post()
  create(@Body() dto: CreateCurrentEmploymentDto, @Req() req: Request) {
    const staffId = req['user'].userId;
    return this.service.create(dto, staffId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
