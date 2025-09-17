import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { BeneficiaryTrainingService } from './beneficiary-training.service';
import { BeneficiaryTraining } from './entities/beneficiary-training.entity';
import { CreateBeneficiaryTrainingDto } from './dto/create-beneficiary-training.dto';
import { UpdateBeneficiaryTrainingDto } from './dto/update-beneficiary-training.dto';
import { BeneficiaryTrainingResponseDto } from './dto/beneficiary-training-response.dto';

@Controller('beneficiary-training')
export class BeneficiaryTrainingController {
  constructor(
    private readonly beneficiaryTrainingService: BeneficiaryTrainingService,
  ) {}

  @Post()
  async create(
    @Body() createBeneficiaryTrainingDto: CreateBeneficiaryTrainingDto,
  ): Promise<BeneficiaryTrainingResponseDto> {
    const result = await this.beneficiaryTrainingService.create(
      createBeneficiaryTrainingDto,
    );
    return new BeneficiaryTrainingResponseDto(result);
  }

  @Get()
  async findAll(): Promise<BeneficiaryTrainingResponseDto[]> {
    const results = await this.beneficiaryTrainingService.findAll();
    return results.map((result) => new BeneficiaryTrainingResponseDto(result));
  }

  @Get('search/by-identifier')
  async findByIdentifier(
    @Query('nic') nicNumber?: string,
    @Query('hh') hhNumber?: string,
  ): Promise<BeneficiaryTrainingResponseDto[]> {
    const results = await this.beneficiaryTrainingService.findByNICOrHH(
      nicNumber,
      hhNumber,
    );
    return results.map((result) => new BeneficiaryTrainingResponseDto(result));
  }

  @Put('update/by-identifier')
  async updateByIdentifier(
    @Body() updateBeneficiaryTrainingDto: UpdateBeneficiaryTrainingDto,
    @Query('nic') nicNumber?: string,
    @Query('hh') hhNumber?: string,
  ): Promise<BeneficiaryTrainingResponseDto[]> {
    const results = await this.beneficiaryTrainingService.updateByNICOrHH(
      updateBeneficiaryTrainingDto,
      nicNumber,
      hhNumber,
    );
    return results.map((result) => new BeneficiaryTrainingResponseDto(result));
  }
}
