import { Module } from '@nestjs/common';
import { EmpowermentRefusalReason } from './entities/empowerment-refusal-reason.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpowermentRefusalReasonService } from './empowerment-refusal-reason.service';
import { EmpowermentRefusalReasonController } from './empowerment-refusal-reason.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmpowermentRefusalReason])],
  providers: [EmpowermentRefusalReasonService],
  controllers: [EmpowermentRefusalReasonController],
})
export class EmpowermentRefusalReasonModule {}
