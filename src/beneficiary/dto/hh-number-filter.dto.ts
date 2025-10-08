import { IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class HhNumberFilterDto {
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
  @IsBoolean()
  @Type(() => Boolean)
  hasConsentedToEmpowerment?: boolean = true;
}
