import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { District } from 'src/location/entities/district.entity';
import { Ds } from 'src/location/entities/ds.entity';
import { Gnd } from 'src/location/entities/gnd.entity';
import { Zone } from 'src/location/entities/zone.entity';
import { BeneficiaryTrainingController } from './beneficiary-training.controller';
import { BeneficiaryTrainingService } from './beneficiary-training.service';
import { BeneficiaryTraining } from './entities/beneficiary-training.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BeneficiaryTraining,
      District,
      Ds,
      Zone,
      Gnd,
      Course,
    ]),
  ],
  controllers: [BeneficiaryTrainingController],
  providers: [BeneficiaryTrainingService],
})
export class BeneficiaryTrainingModule {}
