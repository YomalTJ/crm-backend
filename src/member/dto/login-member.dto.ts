import { IsString, Length } from 'class-validator';

export class LoginMemberDto {
  @IsString()
  @Length(10, 12)
  username: string;

  @IsString()
  @Length(8, 20)
  password: string;
}
