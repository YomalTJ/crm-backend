import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { LivelihoodsService } from './livelihoods.service';
import { CreateLivelihoodDto } from './dto/create-livelihood.dto';
import { UpdateLivelihoodDto } from './dto/update-livelihood.dto';
import { Livelihood } from './entities/livelihood.entity';

@Controller('livelihoods')
export class LivelihoodsController {
  constructor(private readonly livelihoodsService: LivelihoodsService) {}

  @Post()
  create(
    @Body() createLivelihoodDto: CreateLivelihoodDto,
  ): Promise<Livelihood> {
    return this.livelihoodsService.create(createLivelihoodDto);
  }

  @Get()
  findAll(): Promise<Livelihood[]> {
    return this.livelihoodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Livelihood> {
    return this.livelihoodsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLivelihoodDto: UpdateLivelihoodDto,
  ): Promise<Livelihood> {
    return this.livelihoodsService.update(id, updateLivelihoodDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.livelihoodsService.remove(id);
  }
}
