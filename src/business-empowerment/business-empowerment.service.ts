import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessEmpowerment } from './entities/business-empowerment.entity';
import { JobField } from 'src/job-field/entities/job-field.entity';
import { Livelihood } from 'src/livelihoods/entities/livelihood.entity';
import { District } from 'src/location/entities/district.entity';
import { Ds } from 'src/location/entities/ds.entity';
import { Gnd } from 'src/location/entities/gnd.entity';
import { Zone } from 'src/location/entities/zone.entity';
import { ProjectType } from 'src/project-type/entities/project-type.entity';
import { BusinessEmpowermentResponse } from './dto/business-empowerment-response.dto';
import { CreateBusinessEmpowermentDto } from './dto/create-business-empowerment.dto';
import { UpdateBusinessEmpowermentDto } from './dto/update-business-empowerment.dto';

@Injectable()
export class BusinessEmpowermentService {
  constructor(
    @InjectRepository(BusinessEmpowerment)
    private readonly businessEmpowermentRepository: Repository<BusinessEmpowerment>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(Ds)
    private readonly dsRepository: Repository<Ds>,
    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
    @InjectRepository(Gnd)
    private readonly gndRepository: Repository<Gnd>,
    @InjectRepository(Livelihood)
    private readonly livelihoodRepository: Repository<Livelihood>,
    @InjectRepository(ProjectType)
    private readonly projectTypeRepository: Repository<ProjectType>,
    @InjectRepository(JobField)
    private readonly jobFieldRepository: Repository<JobField>,
  ) {}

  async create(
    createDto: CreateBusinessEmpowermentDto,
  ): Promise<BusinessEmpowerment> {
    const businessEmpowerment =
      this.businessEmpowermentRepository.create(createDto);
    return this.businessEmpowermentRepository.save(businessEmpowerment);
  }

  async findByNic(nic: string): Promise<BusinessEmpowermentResponse> {
    const businessEmpowerment =
      await this.businessEmpowermentRepository.findOne({
        where: { nic },
      });

    if (!businessEmpowerment) {
      throw new NotFoundException(
        `Business empowerment record with NIC ${nic} not found`,
      );
    }

    // Enrich with related entity names
    return this.enrichWithEntityNames(businessEmpowerment);
  }

  async updateByNic(
    nic: string,
    updateDto: UpdateBusinessEmpowermentDto,
  ): Promise<BusinessEmpowermentResponse> {
    // First find the record
    const existingRecord = await this.businessEmpowermentRepository.findOne({
      where: { nic },
    });

    if (!existingRecord) {
      throw new NotFoundException(
        `Business empowerment record with NIC ${nic} not found`,
      );
    }

    // Update the record with new data
    const updatedRecord = this.businessEmpowermentRepository.merge(
      existingRecord,
      updateDto,
    );
    const savedRecord =
      await this.businessEmpowermentRepository.save(updatedRecord);

    return this.enrichWithEntityNames(savedRecord);
  }

  async findAll(): Promise<BusinessEmpowermentResponse[]> {
    const records = await this.businessEmpowermentRepository.find({
      order: { createdAt: 'DESC' },
    });

    // Enrich all records with entity names
    return Promise.all(
      records.map((record) => this.enrichWithEntityNames(record)),
    );
  }

  private async enrichWithEntityNames(
    record: BusinessEmpowerment,
  ): Promise<BusinessEmpowermentResponse> {
    // Create a plain object with all properties from the entity
    const enrichedRecord: BusinessEmpowermentResponse = {
      ...record,
      district_name: undefined,
      ds_name: undefined,
      zone_name: undefined,
      gnd_name: undefined,
      livelihood_name: undefined,
      livelihood_sinhala_name: undefined,
      livelihood_tamil_name: undefined,
      project_type_name_english: undefined,
      project_type_name_sinhala: undefined,
      project_type_name_tamil: undefined,
      job_field_name_english: undefined,
      job_field_name_sinhala: undefined,
      job_field_name_tamil: undefined,
    };

    // Get district name
    if (record.district_id) {
      const district = await this.districtRepository.findOne({
        where: { district_id: record.district_id },
      });
      enrichedRecord.district_name = district?.district_name || '';
    }

    // Get DS division name
    if (record.ds_id) {
      const ds = await this.dsRepository.findOne({
        where: { ds_id: record.ds_id },
      });
      enrichedRecord.ds_name = ds?.ds_name || '';
    }

    // Get zone name
    if (record.zone_id) {
      const zone = await this.zoneRepository.findOne({
        where: { zone_id: record.zone_id },
      });
      enrichedRecord.zone_name = zone?.zone_name || '';
    }

    // Get GND name
    if (record.gnd_id) {
      const gnd = await this.gndRepository.findOne({
        where: { gnd_id: record.gnd_id },
      });
      enrichedRecord.gnd_name = gnd?.gnd_name || '';
    }

    // Get livelihood name
    if (record.livelihood_id) {
      const livelihood = await this.livelihoodRepository.findOne({
        where: { id: parseInt(record.livelihood_id) },
      });
      if (livelihood) {
        enrichedRecord.livelihood_name = livelihood.english_name;
        enrichedRecord.livelihood_sinhala_name = livelihood.sinhala_name;
        enrichedRecord.livelihood_tamil_name = livelihood.tamil_name;
      }
    }

    // Get project type name
    if (record.project_type_id) {
      const projectType = await this.projectTypeRepository.findOne({
        where: { project_type_id: record.project_type_id },
      });
      if (projectType) {
        enrichedRecord.project_type_name_english = projectType.nameEnglish;
        enrichedRecord.project_type_name_sinhala = projectType.nameSinhala;
        enrichedRecord.project_type_name_tamil = projectType.nameTamil;
      }
    }

    // Get job field name
    if (record.job_field_id) {
      const jobField = await this.jobFieldRepository.findOne({
        where: { job_field_id: record.job_field_id },
      });
      if (jobField) {
        enrichedRecord.job_field_name_english = jobField.nameEnglish;
        enrichedRecord.job_field_name_sinhala = jobField.nameSinhala;
        enrichedRecord.job_field_name_tamil = jobField.nameTamil;
      }
    }

    return enrichedRecord;
  }
}
