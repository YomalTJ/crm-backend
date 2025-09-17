import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEmpowermentService } from './business-empowerment.service';
import { BusinessEmpowermentController } from './business-empowerment.controller';
import { BusinessEmpowerment } from './entities/business-empowerment.entity';
import { JobField } from 'src/job-field/entities/job-field.entity';
import { Livelihood } from 'src/livelihoods/entities/livelihood.entity';
import { District } from 'src/location/entities/district.entity';
import { Ds } from 'src/location/entities/ds.entity';
import { Gnd } from 'src/location/entities/gnd.entity';
import { Zone } from 'src/location/entities/zone.entity';
import { ProjectType } from 'src/project-type/entities/project-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BusinessEmpowerment,
      District,
      Ds,
      Zone,
      Gnd,
      Livelihood,
      ProjectType,
      JobField,
    ]),
  ],
  controllers: [BusinessEmpowermentController],
  providers: [BusinessEmpowermentService],
})
export class BusinessEmpowermentModule {}
