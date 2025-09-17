import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditController } from './audit.controller';
import { Staff } from 'src/staff/entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog, Staff])],
  providers: [AuditService],
  exports: [AuditService],
  controllers: [AuditController], 
})
export class AuditModule {}
