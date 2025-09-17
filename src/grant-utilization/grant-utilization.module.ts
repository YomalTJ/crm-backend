import { Module } from '@nestjs/common';
import { GrantUtilizationService } from './grant-utilization.service';
import { GrantUtilizationController } from './grant-utilization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from 'src/location/entities/district.entity';
import { Ds } from 'src/location/entities/ds.entity';
import { Gnd } from 'src/location/entities/gnd.entity';
import { Zone } from 'src/location/entities/zone.entity';
import { SamurdhiFamily } from 'src/samurdhi-family/entities/samurdhi-family.entity';
import { GrantUtilization } from './entities/grant-utilization.entity';
import { AuditModule } from 'src/audit/audit.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GrantUtilization,
      SamurdhiFamily,
      District,
      Ds,
      Gnd,
      Zone,
    ]),
    ConfigModule,
    AuthModule,
    AuditModule,
    StaffModule,
  ],
  controllers: [GrantUtilizationController],
  providers: [GrantUtilizationService],
})
export class GrantUtilizationModule {}
