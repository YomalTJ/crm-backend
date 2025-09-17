import { Module } from '@nestjs/common';
import { SamurdhiSubsidyService } from './samurdhi-subsidy.service';
import { SamurdhiSubsidyController } from './samurdhi-subsidy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from 'src/audit/audit.module';
import { SamurdhiSubsisdy } from './entities/samurdhi-subsidy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SamurdhiSubsisdy]), AuditModule],
  providers: [SamurdhiSubsidyService],
  controllers: [SamurdhiSubsidyController]
})
export class SamurdhiSubsidyModule {}
