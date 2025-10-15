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

  async saveHouseholdsWithCitizens(
    households: any[],
    gnCode: string,
  ): Promise<{
    success: boolean;
    savedHouseholds: number;
    savedCitizens: number;
  }> {
    let savedHouseholds = 0;
    let savedCitizens = 0;

    for (const household of households) {
      try {
        // Save or update household
        const householdEntity = this.householdRepository.create({
          hhReference: household.hH_reference,
          gnCode: gnCode,
          applicantName: household.applicant_name,
          addressLine1: household.addressLine_1 || null,
          addressLine2: household.addressLine_2 || null,
          addressLine3: household.addressLine_3 || null,
          singleMother: household.single_Mother === 'Yes' ? 'Yes' : 'No',
          level: household.level,
        });

        await this.householdRepository.save(householdEntity);
        savedHouseholds++;

        // Delete existing citizens for this household
        await this.citizenRepository.delete({
          hhReference: household.hH_reference,
        });

        // Save new citizens
        if (household.citizens && household.citizens.length > 0) {
          for (const citizen of household.citizens) {
            const citizenEntity = this.citizenRepository.create({
              hhReference: household.hH_reference,
              name: citizen.name,
              dateOfBirth: new Date(citizen.date_of_Birth),
              age: citizen.age,
              gender: citizen.gender || 'other',
            });

            await this.citizenRepository.save(citizenEntity);
            savedCitizens++;
          }
        }
      } catch (error) {
        console.error(
          `Error saving household ${household.hH_reference}:`,
          error,
        );
        // Continue with next household
      }
    }

    return {
      success: true,
      savedHouseholds,
      savedCitizens,
    };
  }
}
