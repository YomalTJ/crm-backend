import { IsDecimal, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateSamurdhiSubsidyDto {
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  @IsPositive()
  amount: number;
}
