import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livelihood } from './entities/livelihood.entity';
import { CreateLivelihoodDto } from './dto/create-livelihood.dto';
import { UpdateLivelihoodDto } from './dto/update-livelihood.dto';

@Injectable()
export class LivelihoodsService {
  constructor(
    @InjectRepository(Livelihood)
    private readonly livelihoodsRepository: Repository<Livelihood>,
  ) {}

  async create(createLivelihoodDto: CreateLivelihoodDto): Promise<Livelihood> {
    const livelihood = this.livelihoodsRepository.create(createLivelihoodDto);
    return await this.livelihoodsRepository.save(livelihood);
  }

  async findAll(): Promise<Livelihood[]> {
    return await this.livelihoodsRepository.find();
  }

  async findOne(id: number): Promise<Livelihood> {
    const livelihood = await this.livelihoodsRepository.findOne({
      where: { id },
    });
    if (!livelihood) {
      throw new NotFoundException(`Livelihood with ID ${id} not found`);
    }
    return livelihood;
  }

  async update(
    id: number,
    updateLivelihoodDto: UpdateLivelihoodDto,
  ): Promise<Livelihood> {
    const livelihood = await this.findOne(id);
    Object.assign(livelihood, updateLivelihoodDto);
    return await this.livelihoodsRepository.save(livelihood);
  }

  async remove(id: number): Promise<void> {
    const livelihood = await this.findOne(id);
    await this.livelihoodsRepository.remove(livelihood);
  }
}
