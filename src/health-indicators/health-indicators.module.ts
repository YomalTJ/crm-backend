import { Module } from '@nestjs/common';
import { HealthIndicatorsService } from './health-indicators.service';
import { HealthIndicatorsController } from './health-indicators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthIndicator } from './entities/health-indicator.entity';
import { AuditModule } from 'src/audit/audit.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthIndicator]),
    AuditModule,
    StaffModule,
  ],
  controllers: [HealthIndicatorsController],
  providers: [HealthIndicatorsService],
})
export class HealthIndicatorsModule {}
