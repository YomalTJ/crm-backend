import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MainProgram } from 'src/samurdhi-family/entities/samurdhi-family.entity';

export class ProjectDetailReportDto {
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
  @IsEnum(MainProgram)
  mainProgram?: MainProgram;
}
