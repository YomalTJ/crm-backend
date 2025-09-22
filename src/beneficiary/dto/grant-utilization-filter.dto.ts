import { IsOptional, IsUUID, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GrantUtilizationFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  district_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  ds_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  zone_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  gnd_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mainProgram?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  beneficiary_type_id?: string;
}
