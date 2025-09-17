import { Module } from '@nestjs/common';
import { HouseholdCitizenService } from './household-citizen.service';
import { HouseholdCitizenController } from './household-citizen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from './entities/household.entity';
import { Citizen } from './entities/citizen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Household, Citizen])],
  providers: [HouseholdCitizenService],
  controllers: [HouseholdCitizenController]
})
export class HouseholdCitizenModule {}
