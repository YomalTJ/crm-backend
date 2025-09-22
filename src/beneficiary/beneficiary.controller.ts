import { Controller, Get, Query } from '@nestjs/common';
import {
  BeneficiaryFilterDto,
  DemographicFilterDto,
} from './dto/beneficiary-filter.dto';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryResponseDto } from './dto/beneficiary-response.dto';
import { DemographicResponseDto } from './dto/demographic-response.dto';
import { ProjectOwnerFilterDto } from './dto/project-owner-filter.dto';
import { ProjectOwnerResponseDto } from './dto/project-owner-response.dto';
import { AreaTypeFilterDto } from './dto/area-type-filter.dto';
import { AreaTypeResponseDto } from './dto/area-type-response.dto';
import { BeneficiaryCountFilterDto } from './dto/beneficiary-count-filter.dto';
import { BeneficiaryCountResponseDto } from './dto/beneficiary-count-response.dto';
import { EmpowermentRefusalFilterDto } from './dto/empowerment-refusal-filter.dto';
import { EmpowermentRefusalResponseDto } from './dto/empowerment-refusal-response.dto';
import { BeneficiaryTypeCountFilterDto } from './dto/beneficiary-type-count-filter.dto';
import { BeneficiaryTypeCountResponseDto } from './dto/beneficiary-type-count-response.dto';
import { EmpowermentDimensionCountFilterDto } from './dto/empowerment-dimension-count-filter.dto';
import { EmpowermentDimensionCountResponseDto } from './dto/empowerment-dimension-count-response.dto';
import { GrantUtilizationFilterDto } from './dto/grant-utilization-filter.dto';
import { GrantUtilizationResponseDto } from './dto/grant-utilization-response.dto';

@Controller('beneficiaries')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @Get()
  async getBeneficiaries(
    @Query() filter: BeneficiaryFilterDto,
  ): Promise<BeneficiaryResponseDto[]> {
    return this.beneficiaryService.getBeneficiaries(filter);
  }

  @Get('demographics')
  async getDemographicStatistics(
    @Query() filter: DemographicFilterDto,
  ): Promise<DemographicResponseDto[]> {
    return this.beneficiaryService.getDemographicStatistics(filter);
  }

  @Get('project-owners')
  async getProjectOwnerDetails(
    @Query() filter: ProjectOwnerFilterDto,
  ): Promise<ProjectOwnerResponseDto[]> {
    return this.beneficiaryService.getProjectOwnerDetails(filter);
  }

  @Get('area-types')
  async getAreaTypeStatistics(
    @Query() filter: AreaTypeFilterDto,
  ): Promise<AreaTypeResponseDto[]> {
    return this.beneficiaryService.getAreaTypeStatistics(filter);
  }

  @Get('count-by-year')
  async getBeneficiaryCountByYear(
    @Query() filter: BeneficiaryCountFilterDto,
  ): Promise<BeneficiaryCountResponseDto> {
    return this.beneficiaryService.getBeneficiaryCountByYear(filter);
  }

  @Get('empowerment-refusals')
  async getEmpowermentRefusalReasons(
    @Query() filter: EmpowermentRefusalFilterDto,
  ): Promise<EmpowermentRefusalResponseDto[]> {
    return this.beneficiaryService.getEmpowermentRefusalReasons(filter);
  }

  @Get('type-counts')
  async getBeneficiaryTypeCounts(
    @Query() filter: BeneficiaryTypeCountFilterDto,
  ): Promise<BeneficiaryTypeCountResponseDto> {
    return this.beneficiaryService.getBeneficiaryTypeCounts(filter);
  }

  @Get('empowerment-dimension-counts')
  async getEmpowermentDimensionCounts(
    @Query() filter: EmpowermentDimensionCountFilterDto,
  ): Promise<EmpowermentDimensionCountResponseDto> {
    return this.beneficiaryService.getEmpowermentDimensionCounts(filter);
  }

  @Get('grant-utilization')
  async getGrantUtilization(
    @Query() filter: GrantUtilizationFilterDto,
  ): Promise<GrantUtilizationResponseDto> {
    return this.beneficiaryService.getGrantUtilization(filter);
  }
}
