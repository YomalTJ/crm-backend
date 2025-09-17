import { Module } from '@nestjs/common';
import { ProjectTypeService } from './project-type.service';
import { ProjectTypeController } from './project-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectType } from './entities/project-type.entity';
import { AuditModule } from 'src/audit/audit.module';
import { StaffModule } from 'src/staff/staff.module';
import { Livelihood } from 'src/livelihoods/entities/livelihood.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectType, Livelihood]), AuditModule, StaffModule],
  controllers: [ProjectTypeController],
  providers: [ProjectTypeService],
})
export class ProjectTypeModule {}
