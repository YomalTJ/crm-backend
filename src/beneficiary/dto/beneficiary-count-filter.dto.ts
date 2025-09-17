import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { MainProgram } from 'src/samurdhi-family/entities/samurdhi-family.entity';

export class BeneficiaryCountFilterDto {
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

  @IsOptional()
  @Transform(({ value }) => {
    const years = Array.isArray(value) ? value : value?.split(',');
    return years?.map((year) => parseInt(year)).filter((year) => !isNaN(year));
  })
  years?: number[];
}
