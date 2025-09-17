import { Module } from '@nestjs/common';
import { CurrentEmploymentService } from './current-employment.service';
import { CurrentEmploymentController } from './current-employment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentEmployment } from './entities/current-employment.entity';
import { AuditModule } from 'src/audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([CurrentEmployment]), AuditModule],
  providers: [CurrentEmploymentService],
  controllers: [CurrentEmploymentController],
})
export class CurrentEmploymentModule {}
