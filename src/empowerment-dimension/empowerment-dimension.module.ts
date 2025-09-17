import { Module } from '@nestjs/common';
import { EmpowermentDimensionService } from './empowerment-dimension.service';
import { EmpowermentDimensionController } from './empowerment-dimension.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpowermentDimension } from './entities/empowerment-dimension.entity';
import { AuditModule } from 'src/audit/audit.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmpowermentDimension]),
    AuditModule,
    StaffModule,
  ],
  controllers: [EmpowermentDimensionController],
  providers: [EmpowermentDimensionService],
})
export class EmpowermentDimensionModule {}
