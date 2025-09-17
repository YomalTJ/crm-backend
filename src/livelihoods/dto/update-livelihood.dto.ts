import { PartialType } from '@nestjs/mapped-types';
import { CreateLivelihoodDto } from './create-livelihood.dto';

export class UpdateLivelihoodDto extends PartialType(CreateLivelihoodDto) {}