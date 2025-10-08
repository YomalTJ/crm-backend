import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAccountTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
