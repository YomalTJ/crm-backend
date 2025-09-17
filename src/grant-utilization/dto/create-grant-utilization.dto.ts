import {
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateGrantUtilizationDto {
  @IsUUID()
  @IsNotEmpty()
  hhNumberOrNic: string;

  // Basic grant information
  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  grantDate: string;

  // Livelihood/Self-employment section
  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @IsString()
  @IsOptional()
  equipmentPurchased?: string;

  @IsString()
  @IsOptional()
  animalsPurchased?: string;

  @IsString()
  @IsOptional()
  plantsPurchased?: string;

  @IsString()
  @IsOptional()
  othersPurchased?: string;

  @IsDateString()
  @IsOptional()
  projectStartDate?: string;

  // Employment/Training section
  @IsString()
  @IsOptional()
  employmentOpportunities?: string;

  @IsString()
  @IsOptional()
  traineeName?: string;

  @IsOptional()
  traineeAge?: number;

  @IsString()
  @IsOptional()
  traineeGender?: string;

  @IsString()
  @IsOptional()
  courseName?: string;

  @IsString()
  @IsOptional()
  institutionName?: string;

  @IsDecimal()
  @IsOptional()
  courseFee?: number;

  @IsString()
  @IsOptional()
  courseDuration?: string;

  @IsDateString()
  @IsOptional()
  courseStartDate?: string;

  @IsDateString()
  @IsOptional()
  courseEndDate?: string;
}
