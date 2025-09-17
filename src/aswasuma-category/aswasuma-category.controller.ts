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
import { AswasumaCategoryService } from './aswasuma-category.service';
import { CreateAswasumaCategoryDto } from './dto/create-aswasuma-category.dto';

@Controller('aswasuma-category')
export class AswasumaCategoryController {
  constructor(private service: AswasumaCategoryService) {}

  @Post()
  create(@Body() dto: CreateAswasumaCategoryDto, @Req() req: Request) {
    const staffId = req['user'].userId;
    return this.service.create(dto, staffId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
