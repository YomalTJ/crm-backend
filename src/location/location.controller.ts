import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResponseDto } from './dto/location-response.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly service: LocationService) {}

  @Get('provinces')
  getProvinces() {
    return this.service.getProvinces();
  }

  @Get('districts/:provinceId')
  getDistricts(@Param('provinceId') provinceId: string) {
    return this.service.getDistricts(provinceId);
  }

  @Get('ds/:districtId')
  getDs(@Param('districtId') districtId: string) {
    return this.service.getDsDivisions(districtId);
  }

  @Get('zones/:dsId')
  getZones(@Param('dsId') dsId: string) {
    return this.service.getZones(dsId);
  }

  @Get('gnd/:zoneId')
  getGnds(@Param('zoneId') zoneId: string) {
    return this.service.getGnds(zoneId);
  }

  @Get()
  async getLocations(
    @Query('districtId') districtId?: string,
    @Query('dsId') dsId?: string,
    @Query('zoneId') zoneId?: string,
  ): Promise<LocationResponseDto> {
    return this.service.getLocations(districtId, dsId, zoneId);
  }
}
