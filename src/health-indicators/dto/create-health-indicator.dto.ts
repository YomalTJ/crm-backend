import { IsNotEmpty } from 'class-validator';

export class CreateHealthIndicatorDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  nameSinhala: string;

  @IsNotEmpty()
  nameTamil: string;
}
