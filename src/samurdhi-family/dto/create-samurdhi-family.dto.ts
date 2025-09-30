import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';
import {
  AreaClassification,
  MainProgram,
} from '../entities/samurdhi-family.entity';

export class CreateSamurdhiFamilyDto {
  @IsString() district_id: string;
  @IsString() ds_id: string;
  @IsString() zone_id: string;
  @IsString() gnd_id: string;

  @IsEnum(MainProgram)
  mainProgram: MainProgram;

  @IsBoolean()
  isImpactEvaluation: boolean;

  @IsBoolean()
  hasConsentedToEmpowerment: boolean;

  @IsOptional()
  @IsString()
  consentLetterPath?: string;

  @IsOptional()
  @IsNumber()
  refusal_reason_id?: number;
  @IsOptional() @IsString() consentGivenAt: string;

  @IsString()
  beneficiary_type_id: string;

  @IsEnum(AreaClassification)
  areaClassification: AreaClassification;

  @IsOptional() @IsString() aswasumaHouseholdNo: string;

  @IsString() nic: string;

  @IsString() beneficiaryName: string;

  @IsOptional()
  @IsNumber()
  beneficiaryAge?: number;

  @IsEnum(['Female', 'Male', 'Other'])
  beneficiaryGender: string;

  @IsString() address: string;

  @IsString()
  mobilePhone: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  projectOwnerName?: string;

  @IsOptional()
  @IsNumber()
  projectOwnerAge?: number;

  @IsOptional()
  @IsEnum(['Female', 'Male', 'Other'])
  projectOwnerGender?: string;

  @IsBoolean()
  hasDisability: boolean;

  @IsOptional()
  @IsNumber()
  disability_id?: number;

  @IsNumber()
  maleBelow16: number;

  @IsNumber()
  femaleBelow16: number;

  @IsNumber()
  male16To24: number;

  @IsNumber()
  female16To24: number;

  @IsNumber()
  male25To45: number;

  @IsNumber()
  female25To45: number;

  @IsNumber()
  male46To60: number;

  @IsNumber()
  female46To60: number;

  @IsNumber()
  maleAbove60: number;

  @IsNumber()
  femaleAbove60: number;

  @IsString() employment_id: string;
  @IsOptional() @IsString() otherOccupation: string;
  @IsOptional() @IsString() subsisdy_id: string;
  @IsOptional() @IsString() aswesuma_cat_id: string;

  @IsString()
  empowerment_dimension_id: string;

  @IsOptional() @IsString() livelihood_id: string;
  @IsOptional() @IsString() project_type_id: string;
  @IsOptional() @IsString() otherProject: string;

  @IsOptional() @IsString() childName?: string | null;
  @IsOptional() @IsNumber() childAge?: number | null;
  @IsOptional() @IsString() childGender?: string | null;
  @IsOptional() @IsString() job_field_id: string;
  @IsOptional() @IsString() otherJobField: string;

  // Updated to accept arrays
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  resource_id: string[];

  @IsBoolean() monthlySaving: boolean;
  @IsOptional() @IsNumber() savingAmount: number;

  // Updated to accept arrays
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  health_indicator_id: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  domestic_dynamic_id: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  community_participation_id: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  housing_service_id: string[];

  @IsOptional() @IsString() commercialBankAccountName: string;
  @IsOptional() @IsString() commercialBankAccountNumber: string;
  @IsOptional() @IsString() commercialBankName: string;
  @IsOptional() @IsString() commercialBankBranch: string;

  @IsOptional() @IsString() samurdhiBankAccountName: string;
  @IsOptional() @IsString() samurdhiBankAccountNumber: string;
  @IsOptional() @IsString() samurdhiBankName: string;
  @IsOptional() @IsString() samurdhiBankAccountType: string;

  @IsBoolean()
  wantsAswesumaBankTransfer: boolean;

  @IsOptional()
  @IsString()
  otherBankName?: string;

  @IsOptional()
  @IsString()
  otherBankBranch?: string;

  @IsOptional()
  @IsString()
  otherBankAccountHolder?: string;

  @IsOptional()
  @IsString()
  otherBankAccountNumber?: string;

  @IsBoolean()
  hasOtherGovernmentSubsidy: boolean;

  @IsOptional()
  @IsString()
  otherGovernmentInstitution?: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  otherSubsidyAmount?: number;
}
