import { Module } from '@nestjs/common';
import { AswasumaCategoryService } from './aswasuma-category.service';
import { AswasumaCategoryController } from './aswasuma-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AswasumaCategory } from './entities/aswasuma-category.entity';
import { AuditModule } from 'src/audit/audit.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AswasumaCategory]),
    AuditModule,
    StaffModule,
  ],
  controllers: [AswasumaCategoryController],
  providers: [AswasumaCategoryService],
})
export class AswasumaCategoryModule {}
