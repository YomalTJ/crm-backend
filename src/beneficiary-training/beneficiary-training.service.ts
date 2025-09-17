import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BeneficiaryTraining } from './entities/beneficiary-training.entity';
import { CreateBeneficiaryTrainingDto } from './dto/create-beneficiary-training.dto';
import { UpdateBeneficiaryTrainingDto } from './dto/update-beneficiary-training.dto';
import { District } from '../location/entities/district.entity';
import { Ds } from '../location/entities/ds.entity';
import { Zone } from '../location/entities/zone.entity';
import { Gnd } from '../location/entities/gnd.entity';

@Injectable()
export class BeneficiaryTrainingService {
  constructor(
    @InjectRepository(BeneficiaryTraining)
    private beneficiaryTrainingRepository: Repository<BeneficiaryTraining>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Ds)
    private dsRepository: Repository<Ds>,
    @InjectRepository(Zone)
    private zoneRepository: Repository<Zone>,
    @InjectRepository(Gnd)
    private gndRepository: Repository<Gnd>,
  ) {}

  async create(
    createBeneficiaryTrainingDto: CreateBeneficiaryTrainingDto,
  ): Promise<BeneficiaryTraining> {
    const beneficiaryTraining = this.beneficiaryTrainingRepository.create(
      createBeneficiaryTrainingDto,
    );
    return this.beneficiaryTrainingRepository.save(beneficiaryTraining);
  }

  async findAll(): Promise<BeneficiaryTraining[]> {
    const records = await this.beneficiaryTrainingRepository.find({
      relations: ['course'],
    });

    // Enrich with location details
    return this.enrichWithLocationDetails(records);
  }

  async findByNICOrHH(
    nicNumber?: string,
    hhNumber?: string,
  ): Promise<BeneficiaryTraining[]> {
    if (!nicNumber && !hhNumber) {
      throw new NotFoundException(
        'Either NIC number or HH number must be provided',
      );
    }

    const where: any = {};
    if (nicNumber) where.nicNumber = nicNumber;
    if (hhNumber) where.hhNumber = hhNumber;

    const records = await this.beneficiaryTrainingRepository.find({
      where,
      relations: ['course'],
    });

    if (records.length === 0) {
      const searchParam = nicNumber
        ? `NIC ${nicNumber}`
        : `HH number ${hhNumber}`;
      throw new NotFoundException(
        `BeneficiaryTraining with ${searchParam} not found`,
      );
    }

    // Enrich with location details
    return this.enrichWithLocationDetails(records);
  }

  async updateByNICOrHH(
    updateBeneficiaryTrainingDto: UpdateBeneficiaryTrainingDto,
    nicNumber?: string,
    hhNumber?: string,
  ): Promise<BeneficiaryTraining[]> {
    if (!nicNumber && !hhNumber) {
      throw new NotFoundException(
        'Either NIC number or HH number must be provided',
      );
    }

    const records = await this.findByNICOrHH(nicNumber, hhNumber);
    const updatedRecords: BeneficiaryTraining[] = [];

    for (const record of records) {
      const updatedRecord = await this.beneficiaryTrainingRepository.save({
        ...record,
        ...updateBeneficiaryTrainingDto,
      });
      updatedRecords.push(updatedRecord);
    }

    return updatedRecords;
  }

  private async enrichWithLocationDetails(
    records: BeneficiaryTraining[],
  ): Promise<BeneficiaryTraining[]> {
    // Extract unique location IDs
    const districtIds = [
      ...new Set(records.map((r) => r.districtId).filter((id) => id)),
    ];
    const dsIds = [...new Set(records.map((r) => r.dsId).filter((id) => id))];
    const zoneIds = [
      ...new Set(records.map((r) => r.zoneId).filter((id) => id)),
    ];
    const gndIds = [...new Set(records.map((r) => r.gndId).filter((id) => id))];

    // Fetch location details
    const districts =
      districtIds.length > 0
        ? await this.districtRepository.find({
            where: { district_id: In(districtIds) },
          })
        : [];
    const dss =
      dsIds.length > 0
        ? await this.dsRepository.find({ where: { ds_id: In(dsIds) } })
        : [];
    const zones =
      zoneIds.length > 0
        ? await this.zoneRepository.find({ where: { zone_id: In(zoneIds) } })
        : [];
    const gnds =
      gndIds.length > 0
        ? await this.gndRepository.find({ where: { gnd_id: In(gndIds) } })
        : [];

    // Create lookup maps
    const districtMap = new Map(districts.map((d) => [d.district_id, d]));
    const dsMap = new Map(dss.map((d) => [d.ds_id, d]));
    const zoneMap = new Map(zones.map((z) => [z.zone_id, z]));
    const gndMap = new Map(gnds.map((g) => [g.gnd_id, g]));

    // Enrich records with location details
    return records.map((record) => {
      const enrichedRecord = { ...record } as any;

      if (record.districtId && districtMap.has(record.districtId)) {
        enrichedRecord.district = districtMap.get(record.districtId);
      }

      if (record.dsId && dsMap.has(record.dsId)) {
        enrichedRecord.ds = dsMap.get(record.dsId);
      }

      if (record.zoneId && zoneMap.has(record.zoneId)) {
        enrichedRecord.zone = zoneMap.get(record.zoneId);
      }

      if (record.gndId && gndMap.has(record.gndId)) {
        enrichedRecord.gnd = gndMap.get(record.gndId);
      }

      return enrichedRecord as BeneficiaryTraining;
    });
  }
}
