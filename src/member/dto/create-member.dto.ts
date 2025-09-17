import {
  IsString,
  Length,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;

  @IsString()
  @Length(10, 12)
  nic: string;

  @IsString()
  address: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
