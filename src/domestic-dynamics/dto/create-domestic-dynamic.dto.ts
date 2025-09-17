import { IsNotEmpty } from 'class-validator';

export class CreateDomesticDynamicDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  nameSinhala: string;

  @IsNotEmpty()
  nameTamil: string;
}