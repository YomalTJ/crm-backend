import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HouseholdCitizenService } from './household-citizen.service';
import { HouseholdCitizenResponseDto } from './dto/household-citizen-response.dto';
import { HouseholdListDto } from './dto/household-list.dto';

@Controller('household-citizen')
export class HouseholdCitizenController {
  constructor(
    private readonly householdCitizenService: HouseholdCitizenService,
  ) {}

  @Get(':hhReference')
  async getHouseholdWithCitizens(
    @Param('hhReference') hhReference: string,
  ): Promise<HouseholdCitizenResponseDto> {
    return this.householdCitizenService.getHouseholdWithCitizens(hhReference);
  }

  @Get('by-gn-code/:gnCode')
  async getHouseholdNumbersByGnCode(
    @Param('gnCode') gnCode: string,
  ): Promise<HouseholdListDto> {
    return this.householdCitizenService.getHouseholdNumbersByGnCode(gnCode);
  }

  @Post('bulk-save')
  async saveHouseholdsWithCitizens(
    @Body() data: { households: any[]; gnCode: string },
  ): Promise<{
    success: boolean;
    savedHouseholds: number;
    savedCitizens: number;
  }> {
    return this.householdCitizenService.saveHouseholdsWithCitizens(
      data.households,
      data.gnCode,
    );
  }
}
