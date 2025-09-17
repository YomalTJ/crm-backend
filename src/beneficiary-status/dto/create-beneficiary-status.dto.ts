import { IsNotEmpty } from 'class-validator';

export class CreateBeneficiaryStatusDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  nameSinhala: string;

  @IsNotEmpty()
  nameTamil: string;
}