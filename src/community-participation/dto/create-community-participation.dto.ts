import { IsNotEmpty } from 'class-validator';

export class CreateCommunityParticipationDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  nameSinhala: string;

  @IsNotEmpty()
  nameTamil: string;
}