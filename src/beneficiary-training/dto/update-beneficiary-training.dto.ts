import { PartialType } from '@nestjs/mapped-types';
import { CreateBeneficiaryTrainingDto } from './create-beneficiary-training.dto';

export class UpdateBeneficiaryTrainingDto extends PartialType(
  CreateBeneficiaryTrainingDto,
) {}
