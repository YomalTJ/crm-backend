import {
  IsEnum,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStaffDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsEnum(['ENGLISH', 'TAMIL', 'SINHALA'])
  language: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;

  @IsUUID()
  userRoleId: string;

  @IsString()
  locationCode: string;
}
