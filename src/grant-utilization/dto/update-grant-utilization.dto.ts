import { IsDecimal, IsOptional, IsDateString, IsString } from 'class-validator';

export class UpdateGrantUtilizationDto {
  // Location IDs
  @IsString()
  @IsOptional()
  districtId?: string;

  @IsString()
  @IsOptional()
  dsId?: string;

  @IsString()
  @IsOptional()
  zoneId?: string;

  @IsString()
  @IsOptional()
  gndId?: string;

  // Basic grant information
  @IsDecimal()
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  grantDate?: string;

  // Grant type fields
  @IsDecimal()
  @IsOptional()
  financialAid?: number;

  @IsDecimal()
  @IsOptional()
  interestSubsidizedLoan?: number;

  @IsDecimal()
  @IsOptional()
  samurdiBankLoan?: number;

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
