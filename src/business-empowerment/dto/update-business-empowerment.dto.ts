import { IsOptional, IsString, IsPhoneNumber, IsNumber } from 'class-validator';

export class UpdateBusinessEmpowermentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  district_id?: string;

  @IsOptional()
  @IsString()
  ds_id?: string;

  @IsOptional()
  @IsString()
  zone_id?: string;

  @IsOptional()
  @IsString()
  gnd_id?: string;

  // Optional fields
  @IsOptional()
  @IsString()
  livelihood_id?: string;

  @IsOptional()
  @IsString()
  project_type_id?: string;

  @IsOptional()
  @IsString()
  job_field_id?: string;

  @IsOptional()
  @IsNumber()
  governmentContribution?: number;

  @IsOptional()
  @IsNumber()
  beneficiaryContribution?: number;

  @IsOptional()
  @IsNumber()
  bankLoan?: number;

  @IsOptional()
  @IsNumber()
  linearOrganizationContribution?: number;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsString()
  capitalAssets?: string;

  @IsOptional()
  @IsNumber()
  expectedMonthlyProfit?: number;

  @IsOptional()
  @IsString()
  advisingMinistry?: string;

  @IsOptional()
  @IsString()
  officerName?: string;

  @IsOptional()
  @IsString()
  officerPosition?: string;

  @IsOptional()
  @IsPhoneNumber()
  officerMobileNumber?: string;

  @IsOptional()
  @IsString()
  developmentOfficer?: string;

  @IsOptional()
  @IsString()
  projectManager?: string;

  @IsOptional()
  @IsString()
  technicalOfficer?: string;

  @IsOptional()
  @IsString()
  divisionalSecretary?: string;
}
