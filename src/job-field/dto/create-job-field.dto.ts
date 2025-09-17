import { IsNotEmpty } from 'class-validator';

export class CreateJobFieldDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  nameSinhala: string;

  @IsNotEmpty()
  nameTamil: string;
}
