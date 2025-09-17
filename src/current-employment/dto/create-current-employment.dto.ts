import { IsNotEmpty } from 'class-validator';

export class CreateCurrentEmploymentDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  nameSinhala: string;

  @IsNotEmpty()
  nameTamil: string;
}
