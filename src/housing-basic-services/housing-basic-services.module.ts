import { Module } from '@nestjs/common';
import { HousingBasicServicesService } from './housing-basic-services.service';
import { HousingBasicServicesController } from './housing-basic-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousingBasicService } from './entities/housing-basic-service.entity';
import { AuditModule } from 'src/audit/audit.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HousingBasicService]),
    AuditModule,
    StaffModule,
  ],
  controllers: [HousingBasicServicesController],
  providers: [HousingBasicServicesService],
})
export class HousingBasicServicesModule {}
