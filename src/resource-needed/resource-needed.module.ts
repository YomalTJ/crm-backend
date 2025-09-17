import { Module } from '@nestjs/common';
import { ResourceNeededService } from './resource-needed.service';
import { ResourceNeededController } from './resource-needed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceNeeded } from './entities/resource-needed.entity';
import { AuditModule } from 'src/audit/audit.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceNeeded]),
    AuditModule,
    StaffModule,
  ],
  controllers: [ResourceNeededController],
  providers: [ResourceNeededService],
})
export class ResourceNeededModule {}
