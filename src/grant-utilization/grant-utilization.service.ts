import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from 'src/location/entities/district.entity';
import { Ds } from 'src/location/entities/ds.entity';
import { Gnd } from 'src/location/entities/gnd.entity';
import { Zone } from 'src/location/entities/zone.entity';
import { SamurdhiFamily } from 'src/samurdhi-family/entities/samurdhi-family.entity';
import { Repository } from 'typeorm';
import { CreateGrantUtilizationDto } from './dto/create-grant-utilization.dto';
import { GrantUtilization } from './entities/grant-utilization.entity';
import { AuditService } from 'src/audit/audit.service';
import { Staff } from 'src/staff/entities/staff.entity';
import { UpdateGrantUtilizationDto } from './dto/update-grant-utilization.dto';

@Injectable()
export class GrantUtilizationService {
  constructor(
    @InjectRepository(GrantUtilization)
    private readonly grantUtilizationRepo: Repository<GrantUtilization>,
    @InjectRepository(SamurdhiFamily)
    private readonly samurdhiFamilyRepo: Repository<SamurdhiFamily>,
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
    @InjectRepository(Ds)
    private readonly dsRepo: Repository<Ds>,
    @InjectRepository(Gnd)
    private readonly gndRepo: Repository<Gnd>,
    @InjectRepository(Zone)
    private readonly zoneRepo: Repository<Zone>,
    private auditService: AuditService,
  ) {}

  async create(createDto: CreateGrantUtilizationDto, staffId: string) {
    const staff = await this.grantUtilizationRepo.manager.findOneByOrFail(
      Staff,
      { id: staffId },
    );

    const { hhNumberOrNic, ...rest } = createDto;

    const samurdhiFamily = await this.samurdhiFamilyRepo.findOneOrFail({
      where: [{ aswasumaHouseholdNo: hhNumberOrNic }, { nic: hhNumberOrNic }],
      relations: [
        'district',
        'divisionalSecretariat',
        'gramaNiladhariDivision',
        'samurdhiBank',
      ],
    });

    const grantUtilization = this.grantUtilizationRepo.create({
      ...rest,
      hhNumberOrNic,
      createdBy: staff,
      districtId: samurdhiFamily.district?.district_id,
      dsId: samurdhiFamily.divisionalSecretariat?.ds_id,
      zoneId: samurdhiFamily.samurdhiBank?.zone_id,
      gndId: samurdhiFamily.gramaNiladhariDivision?.gnd_id,
    });

    const savedGrantUtilization =
      await this.grantUtilizationRepo.save(grantUtilization);

    await this.auditService.log(
      'CREATE',
      'GrantUtilization',
      savedGrantUtilization.id,
      staffId,
      null,
      savedGrantUtilization,
    );

    return savedGrantUtilization;
  }

  async updateByHhNumberOrNic(
    hhNumberOrNic: string,
    updateDto: UpdateGrantUtilizationDto,
    staffId: string,
  ) {
    // Find the grant utilization record by hhNumberOrNic
    const grantUtilization = await this.grantUtilizationRepo.findOne({
      where: { hhNumberOrNic },
    });

    if (!grantUtilization) {
      throw new NotFoundException(
        `Grant utilization record with hhNumberOrNic ${hhNumberOrNic} not found`,
      );
    }

    // Store the old values for audit logging
    const oldValues = { ...grantUtilization };

    // Update the record with new values
    Object.assign(grantUtilization, updateDto);

    // Save the updated record
    const updatedGrantUtilization =
      await this.grantUtilizationRepo.save(grantUtilization);

    // Log the update action in audit trail
    await this.auditService.log(
      'UPDATE',
      'GrantUtilization',
      updatedGrantUtilization.id,
      staffId,
      oldValues,
      updatedGrantUtilization,
    );

    return updatedGrantUtilization;
  }

  async findByHhNumberOrNicWithFamily(hhNumberOrNic: string) {
    // First get the samurdhi family details
    const samurdhiFamily = await this.samurdhiFamilyRepo.findOne({
      where: [{ aswasumaHouseholdNo: hhNumberOrNic }, { nic: hhNumberOrNic }],
      relations: [
        'district',
        'divisionalSecretariat',
        'gramaNiladhariDivision',
        'samurdhiBank',
      ],
    });

    if (!samurdhiFamily) {
      throw new NotFoundException(
        `Samurdhi family with hhNumberOrNic ${hhNumberOrNic} not found`,
      );
    }

    // Then get all grant utilizations for this family
    const grantUtilizations = await this.grantUtilizationRepo.find({
      where: { hhNumberOrNic },
      order: { grantDate: 'DESC' },
      relations: ['createdBy'],
    });

    return {
      familyDetails: {
        aswasumaHouseholdNo: samurdhiFamily.aswasumaHouseholdNo,
        nic: samurdhiFamily.nic,
        district: {
          id: samurdhiFamily.district?.district_id,
          name: samurdhiFamily.district?.district_name,
        },
        dsDivision: {
          id: samurdhiFamily.divisionalSecretariat?.ds_id,
          name: samurdhiFamily.divisionalSecretariat?.ds_name,
        },
        gnd: {
          id: samurdhiFamily.gramaNiladhariDivision?.gnd_id,
          name: samurdhiFamily.gramaNiladhariDivision?.gnd_name,
        },
        zone: {
          id: samurdhiFamily.samurdhiBank?.zone_id,
          name: samurdhiFamily.samurdhiBank?.zone_name,
        },
      },
      grantUtilizations: grantUtilizations.map((utilization) => ({
        id: utilization.id,
        districtId: utilization.districtId,
        dsId: utilization.dsId,
        zoneId: utilization.zoneId,
        gndId: utilization.gndId,
        amount: utilization.amount,
        grantDate: utilization.grantDate,
        financialAid: utilization.financialAid,
        interestSubsidizedLoan: utilization.interestSubsidizedLoan,
        samurdiBankLoan: utilization.samurdiBankLoan,
        purchaseDate: utilization.purchaseDate,
        equipmentPurchased: utilization.equipmentPurchased,
        animalsPurchased: utilization.animalsPurchased,
        plantsPurchased: utilization.plantsPurchased,
        othersPurchased: utilization.othersPurchased,
        projectStartDate: utilization.projectStartDate,
        employmentOpportunities: utilization.employmentOpportunities,
        traineeName: utilization.traineeName,
        traineeAge: utilization.traineeAge,
        traineeGender: utilization.traineeGender,
        courseName: utilization.courseName,
        institutionName: utilization.institutionName,
        courseFee: utilization.courseFee,
        courseDuration: utilization.courseDuration,
        courseStartDate: utilization.courseStartDate,
        courseEndDate: utilization.courseEndDate,
      })),
    };
  }
}
