import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLivelihoodDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  english_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  sinhala_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  tamil_name: string;
}
