import { IsNotEmpty } from 'class-validator';

export class CreateHousingBasicServiceDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  nameSinhala: string;

  @IsNotEmpty()
  nameTamil: string;
}
