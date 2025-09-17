import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { MainProgram } from 'src/samurdhi-family/entities/samurdhi-family.entity';

export class EmpowermentRefusalFilterDto {
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
  @IsEnum(MainProgram)
  mainProgram?: MainProgram;
}
