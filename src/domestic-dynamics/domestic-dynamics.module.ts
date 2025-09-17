import { Module } from '@nestjs/common';
import { DomesticDynamicsService } from './domestic-dynamics.service';
import { DomesticDynamicsController } from './domestic-dynamics.controller';
import { AuditModule } from 'src/audit/audit.module';
import { DomesticDynamic } from './entities/domestic-dynamic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DomesticDynamic]),
    AuditModule,
    StaffModule,
  ],
  providers: [DomesticDynamicsService],
  controllers: [DomesticDynamicsController],
})
export class DomesticDynamicsModule {}
