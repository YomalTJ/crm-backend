import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDecimal,
} from 'class-validator';

export class CreateBeneficiaryTrainingDto {
  @IsOptional()
  districtId: string;

  @IsOptional()
  dsId: string;

  @IsOptional()
  zoneId: string;

  @IsOptional()
  gndId: string;

  @IsOptional()
  hhNumber: string;

  @IsOptional()
  nicNumber: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  @IsBoolean()
  trainingActivitiesDone: boolean;

  @IsOptional()
  @IsBoolean()
  trainingActivitiesRequired: boolean;

  @IsOptional()
  courseId: number;

  @IsOptional()
  trainingInstitution: string;

  @IsOptional()
  trainingInstituteAddress: string;

  @IsOptional()
  trainingInstitutePhone: string;

  @IsOptional()
  courseCost: number;

  @IsOptional()
  trainingDuration: string;

  @IsOptional()
  trainerName: string;

  @IsOptional()
  trainerContactNumber: string;
}
