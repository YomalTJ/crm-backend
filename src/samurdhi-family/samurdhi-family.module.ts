import { Module } from '@nestjs/common';
import { SamurdhiFamilyController } from './samurdhi-family.controller';
import { SamurdhiFamilyService } from './samurdhi-family.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SamurdhiFamily } from './entities/samurdhi-family.entity';
import { ResourceNeeded } from 'src/resource-needed/entities/resource-needed.entity';
import { HealthIndicator } from 'src/health-indicators/entities/health-indicator.entity';
import { DomesticDynamic } from 'src/domestic-dynamics/entities/domestic-dynamic.entity';
import { CommunityParticipation } from 'src/community-participation/entities/community-participation.entity';
import { HousingBasicService } from 'src/housing-basic-services/entities/housing-basic-service.entity';
import { AuditModule } from 'src/audit/audit.module';
import { StaffModule } from 'src/staff/staff.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmpowermentRefusalReason } from 'src/empowerment-refusal-reason/entities/empowerment-refusal-reason.entity';
import { Disability } from 'src/disability/entities/disability.entity';
import { Zone } from 'src/location/entities/zone.entity';
import { Gnd } from 'src/location/entities/gnd.entity';
import { Ds } from 'src/location/entities/ds.entity';
import { District } from 'src/location/entities/district.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SamurdhiFamily,
      ResourceNeeded,
      HealthIndicator,
      DomesticDynamic,
      CommunityParticipation,
      HousingBasicService,
      AuthModule,
      ConfigModule,
      EmpowermentRefusalReason,
      Disability,
      District,
      Ds,
      Zone,
      Gnd
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    AuthModule,
    AuditModule,
    StaffModule,
  ],
  controllers: [SamurdhiFamilyController],
  providers: [SamurdhiFamilyService],
})
export class SamurdhiFamilyModule {}
