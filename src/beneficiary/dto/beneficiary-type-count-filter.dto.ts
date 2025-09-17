import { IsOptional, IsUUID } from 'class-validator';

export class BeneficiaryTypeCountFilterDto {
  @IsOptional()
  @IsUUID()
  district_id?: string;

  @IsOptional()
  @IsUUID()
  ds_id?: string;

  @IsOptional()
  @IsUUID()
  zone_id?: string;

  @IsOptional()
  @IsUUID()
  gnd_id?: string;
}
