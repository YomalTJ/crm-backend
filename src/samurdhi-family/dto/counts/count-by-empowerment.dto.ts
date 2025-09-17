import { IsOptional, IsString } from 'class-validator';

export class CountByEmpowermentDto {
  @IsOptional()
  @IsString()
  district_id?: string;

  @IsOptional()
  @IsString()
  ds_id?: string;

  @IsOptional()
  @IsString()
  zone_id?: string;

  @IsOptional()
  @IsString()
  gnd_id?: string;

  @IsOptional()
  @IsString()
  empowerment_dimension_id?: string;
}
