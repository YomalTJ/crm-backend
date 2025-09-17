import { IsOptional, IsNumber } from 'class-validator';

export class LocationFiltersDto {
  @IsOptional()
  @IsNumber()
  district_id?: number;

  @IsOptional()
  @IsNumber()
  ds_id?: number;

  @IsOptional()
  @IsNumber()
  zone_id?: number;

  @IsOptional()
  @IsNumber()
  gnd_id?: number;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}