import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProjectTypeDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  nameSinhala: string;

  @IsNotEmpty()
  nameTamil: string;

  @IsNotEmpty()
  @IsUUID()
  livelihoodId: string;
}
