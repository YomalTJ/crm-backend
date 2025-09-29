import { IsOptional, IsString, IsUUID } from 'class-validator';

export class BeneficiaryDetailsFilterDto {
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

  @IsOptional()
  @IsString()
  mainProgram?: string;

  @IsOptional()
  @IsUUID()
  empowerment_dimension_id?: string;
}
