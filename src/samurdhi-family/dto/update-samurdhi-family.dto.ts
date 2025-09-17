import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  AreaClassification,
  MainProgram,
} from '../entities/samurdhi-family.entity';

export class UpdateSamurdhiFamilyDto {
  @IsOptional() @IsString() district_id: string;
  @IsOptional() @IsString() ds_id: string;
  @IsOptional() @IsString() zone_id: string;
  @IsOptional() @IsString() gnd_id: string;

  @IsOptional()
  @IsEnum(MainProgram)
  mainProgram?: MainProgram;

  @IsBoolean()
  @IsOptional()
  isImpactEvaluation?: boolean;

  @IsOptional()
  @IsBoolean()
  hasConsentedToEmpowerment?: boolean;

  @IsOptional()
  @IsString()
  consentLetterPath?: string;

  @IsOptional()
  @IsNumber()
  refusal_reason_id?: number;

  @IsOptional() @IsString() consentGivenAt?: string;

  @IsOptional() @IsString() beneficiary_type_id?: string;

  @IsOptional()
  @IsEnum(AreaClassification)
  areaClassification?: AreaClassification;

  @IsOptional() @IsString() aswasumaHouseholdNo?: string;

  @IsOptional() @IsString() nic?: string;

  @IsOptional() @IsString() beneficiaryName?: string;

  @IsOptional()
  @IsEnum(['Female', 'Male', 'Other'])
  beneficiaryGender?: string;

  @IsOptional() @IsString() address?: string;

  @IsOptional() @IsString() mobilePhone?: string;

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

  @IsOptional()
  @IsBoolean()
  hasDisability?: boolean;

  @IsOptional()
  @IsNumber()
  disability_id?: number;

  @IsOptional()
  @IsNumber()
  maleBelow16?: number;

  @IsOptional()
  @IsNumber()
  femaleBelow16?: number;

  @IsOptional()
  @IsNumber()
  male16To24?: number;

  @IsOptional()
  @IsNumber()
  female16To24?: number;

  @IsOptional()
  @IsNumber()
  male25To45?: number;

  @IsOptional()
  @IsNumber()
  female25To45?: number;

  @IsOptional()
  @IsNumber()
  male46To60?: number;

  @IsOptional()
  @IsNumber()
  female46To60?: number;

  @IsOptional()
  @IsNumber()
  maleAbove60?: number;

  @IsOptional()
  @IsNumber()
  femaleAbove60?: number;

  @IsOptional() @IsString() employment_id?: string;
  @IsOptional() @IsString() otherOccupation?: string;
  @IsOptional() @IsString() subsisdy_id?: string;
  @IsOptional() @IsString() aswesuma_cat_id?: string;

  @IsOptional() @IsString() empowerment_dimension_id?: string;

  @IsOptional() @IsString() livelihood_id: number;
  @IsOptional() @IsString() project_type_id?: string;
  @IsOptional() @IsString() otherProject?: string;

  @IsOptional() @IsString() childName?: string;
  @IsOptional() @IsNumber() childAge?: number;
  @IsOptional() @IsString() childGender?: string;
  @IsOptional() @IsString() job_field_id?: string;
  @IsOptional() @IsString() otherJobField?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  resource_id?: string[];

  @IsOptional() @IsBoolean() monthlySaving?: boolean;
  @IsOptional() @IsNumber() savingAmount?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  health_indicator_id?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  domestic_dynamic_id?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  community_participation_id?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  housing_service_id?: string[];

  @IsOptional() @IsString() commercialBankAccountName?: string;
  @IsOptional() @IsString() commercialBankAccountNumber?: string;
  @IsOptional() @IsString() commercialBankName?: string;
  @IsOptional() @IsString() commercialBankBranch?: string;

  @IsOptional() @IsString() samurdhiBankAccountName?: string;
  @IsOptional() @IsString() samurdhiBankAccountNumber?: string;
  @IsOptional() @IsString() samurdhiBankName?: string;
  @IsOptional() @IsString() samurdhiBankAccountType?: string;

  @IsOptional()
  @IsBoolean()
  wantsAswesumaBankTransfer?: boolean;

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

  @IsOptional()
  @IsBoolean()
  hasOtherGovernmentSubsidy?: boolean;

  @IsOptional()
  @IsString()
  otherGovernmentInstitution?: string;

  @IsOptional()
  @IsNumber()
  otherSubsidyAmount?: number;
}
