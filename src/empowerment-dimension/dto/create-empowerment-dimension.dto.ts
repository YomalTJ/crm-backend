import { IsNotEmpty } from 'class-validator';

export class CreateEmpowermentDimensionDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  nameSinhala: string;

  @IsNotEmpty()
  nameTamil: string;
}