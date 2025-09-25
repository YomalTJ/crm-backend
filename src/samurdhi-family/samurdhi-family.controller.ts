import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SamurdhiFamilyService } from './samurdhi-family.service';
import { CreateSamurdhiFamilyDto } from './dto/create-samurdhi-family.dto';
import { CountBeneficiariesDto } from './dto/counts/count-beneficiaries.dto';
import { CountByEmpowermentDto } from './dto/counts/count-by-empowerment.dto';
import { ProjectDetailReportDto } from './dto/counts/project-detail-report.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateSamurdhiFamilyDto } from './dto/update-samurdhi-family.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('samurdhi-family')
export class SamurdhiFamilyController {
  constructor(private readonly familyService: SamurdhiFamilyService) { }

  @Post()
  @UseInterceptors(FileInterceptor('consentLetter'))
  async create(
    @Body() dto: CreateSamurdhiFamilyDto,
    @UploadedFile() consentLetter: Express.Multer.File,
    @Req() req: Request,
  ) {
    try {
      const staffId = req['user'].userId;
      return await this.familyService.create(dto, staffId, consentLetter);
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get('count-report')
  @UseGuards(AuthGuard)
  async getCountReport(
    @Query() filters: CountBeneficiariesDto,
    @Req() req: Request,
  ) {
    try {
      const user = req['user'];
      if (!user) {
        throw new Error('User not found in request object');
      }
      return await this.familyService.getCountReport(filters, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('empowerment-count-report')
  @UseGuards(AuthGuard)
  async getEmpowermentCountReport(
    @Query() filters: CountByEmpowermentDto,
    @Req() req: Request,
  ) {
    try {
      const user = req['user'];
      if (!user) {
        throw new Error('User not found in request object');
      }
      return await this.familyService.getEmpowermentCountReport(filters, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('accessible-locations')
  @UseGuards(AuthGuard)
  async getAccessibleLocations(@Req() req: Request) {
    try {
      const user = req['user'];
      if (!user) {
        throw new Error('User not found in request object');
      }
      return await this.familyService.getAccessibleLocations(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('project-details')
  @UseGuards(AuthGuard)
  async getProjectDetails(
    @Query() filters: ProjectDetailReportDto,
    @Req() req: Request,
  ) {
    try {
      const user = req['user'];
      if (!user) {
        throw new Error('User not found in request object');
      }
      return await this.familyService.getFilteredProjectDetails(filters, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('created-by-me')
  @UseGuards(AuthGuard)
  async findAllByCreator(@Req() req: Request) {
    const staffId = req['user'].userId;
    return this.familyService.findAllByCreator(staffId);
  }

  @Put(':identifier')
  @UseGuards(AuthGuard)
  async updateByIdentifier(
    @Param('identifier') identifier: string,
    @Body() dto: UpdateSamurdhiFamilyDto,
    @Req() req: Request,
  ) {
    const staffId = req['user'].userId;
    return this.familyService.updateByNICOrHH(identifier, dto, staffId);
  }

  @Get(':identifier')
  async findByIdentifier(@Param('identifier') identifier: string) {
    return this.familyService.findByNICOrHH(identifier);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getFamiliesByLocation(
    @Query('district_id') districtId?: string,
    @Query('ds_id') dsId?: string,
    @Query('zone_id') zoneId?: string,
    @Query('gnd_id') gndId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.familyService.getFamiliesByLocation({
      district_id: districtId,
      ds_id: dsId,
      zone_id: zoneId,
      gnd_id: gndId,
      page,
      limit,
    });
  }

  @Get('check-exists')
  async checkExists(
    @Query('nic') nic?: string,
    @Query('household') household?: string
  ) {
    if (nic) {
      return await this.familyService.checkExistsByNic(nic);
    } else if (household) {
      return await this.familyService.checkExistsByHousehold(household);
    }
    throw new BadRequestException('Either NIC or household number is required');
  }
}
