import { IsNotEmpty } from 'class-validator';

export class CreateAswasumaCategoryDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  nameSinhala: string;

  @IsNotEmpty()
  nameTamil: string;
}
