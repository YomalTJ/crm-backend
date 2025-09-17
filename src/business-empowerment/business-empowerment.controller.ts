import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { BusinessEmpowermentService } from './business-empowerment.service';
import { BusinessEmpowerment } from './entities/business-empowerment.entity';
import { BusinessEmpowermentResponse } from './dto/business-empowerment-response.dto';
import { CreateBusinessEmpowermentDto } from './dto/create-business-empowerment.dto';
import { UpdateBusinessEmpowermentDto } from './dto/update-business-empowerment.dto';

@Controller('business-empowerment')
export class BusinessEmpowermentController {
  constructor(
    private readonly businessEmpowermentService: BusinessEmpowermentService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBusinessEmpowermentDto: CreateBusinessEmpowermentDto,
  ): Promise<BusinessEmpowerment> {
    return this.businessEmpowermentService.create(createBusinessEmpowermentDto);
  }

  @Get('nic/:nic')
  async findByNic(
    @Param('nic') nic: string,
  ): Promise<BusinessEmpowermentResponse> {
    try {
      return await this.businessEmpowermentService.findByNic(nic);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Put('nic/:nic')
  async updateByNic(
    @Param('nic') nic: string,
    @Body() updateBusinessEmpowermentDto: UpdateBusinessEmpowermentDto,
  ): Promise<BusinessEmpowermentResponse> {
    try {
      return await this.businessEmpowermentService.updateByNic(
        nic,
        updateBusinessEmpowermentDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<BusinessEmpowermentResponse[]> {
    return this.businessEmpowermentService.findAll();
  }
}
