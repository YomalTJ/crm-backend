import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Household } from './entities/household.entity';
import { Citizen } from './entities/citizen.entity';
import { HouseholdCitizenResponseDto } from './dto/household-citizen-response.dto';
import { HouseholdListDto } from './dto/household-list.dto';

@Injectable()
export class HouseholdCitizenService {
  constructor(
    @InjectRepository(Household)
    private readonly householdRepository: Repository<Household>,
    @InjectRepository(Citizen)
    private readonly citizenRepository: Repository<Citizen>,
  ) {}

  async getHouseholdWithCitizens(
    hhReference: string,
  ): Promise<HouseholdCitizenResponseDto> {
    const household = await this.householdRepository.findOne({
      where: { hhReference },
      relations: ['citizens'],
    });

    if (!household) {
      throw new Error('Household not found');
    }

    return {
      household: {
        hhReference: household.hhReference,
        gnCode: household.gnCode,
        applicantName: household.applicantName,
        addressLine1: household.addressLine1,
        addressLine2: household.addressLine2,
        addressLine3: household.addressLine3,
        singleMother: household.singleMother,
        level: household.level,
      },
      citizens: household.citizens.map((citizen) => ({
        name: citizen.name,
        dateOfBirth: citizen.dateOfBirth,
        age: citizen.age,
        gender: citizen.gender,
      })),
    };
  }

  async getHouseholdNumbersByGnCode(gnCode: string): Promise<HouseholdListDto> {
    const households = await this.householdRepository.find({
      where: { gnCode },
      select: ['hhReference'],
    });

    const sortedHouseholds = households.sort((a, b) => {
      const aLastPart = a.hhReference.split('-').pop();
      const bLastPart = b.hhReference.split('-').pop();

      const aNumber = aLastPart ? parseInt(aLastPart, 10) : 0;
      const bNumber = bLastPart ? parseInt(bLastPart, 10) : 0;

      return aNumber - bNumber;
    });

    return {
      hhReferences: sortedHouseholds.map((household) => household.hhReference),
    };
  }
}
