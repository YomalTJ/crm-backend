import {
  IsNotEmpty,
  IsPhoneNumber,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBusinessEmpowermentDto {
  // Mandatory fields
  @IsNotEmpty()
  @IsString()
  nic: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber('LK')
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  district_id: string;

  @IsNotEmpty()
  @IsString()
  ds_id: string;

  @IsNotEmpty()
  @IsString()
  zone_id: string;

  @IsNotEmpty()
  @IsString()
  gnd_id: string;

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
