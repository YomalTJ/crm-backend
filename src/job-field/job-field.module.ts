import { Module } from '@nestjs/common';
import { JobFieldService } from './job-field.service';
import { JobFieldController } from './job-field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobField } from './entities/job-field.entity';
import { AuditModule } from 'src/audit/audit.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobField]), AuditModule, StaffModule],
  controllers: [JobFieldController],
  providers: [JobFieldService],
})
export class JobFieldModule {}
