import { Module } from '@nestjs/common';
import { CommunityParticipationService } from './community-participation.service';
import { CommunityParticipationController } from './community-participation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityParticipation } from './entities/community-participation.entity';
import { AuditModule } from 'src/audit/audit.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommunityParticipation]),
    AuditModule,
    StaffModule,
  ],
  providers: [CommunityParticipationService],
  controllers: [CommunityParticipationController]
})
export class CommunityParticipationModule {}
