import { Module } from '@nestjs/common';
import { BeneficiaryStatusService } from './beneficiary-status.service';
import { BeneficiaryStatusController } from './beneficiary-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BeneficiaryStatus } from './entities/beneficiary-status.entity';
import { AuditModule } from 'src/audit/audit.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BeneficiaryStatus]),
    AuditModule,
    StaffModule,
  ],
  controllers: [BeneficiaryStatusController],
  providers: [BeneficiaryStatusService],
})
export class BeneficiaryStatusModule {}
