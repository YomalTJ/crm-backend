import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MainProgram, SamurdhiFamily } from './entities/samurdhi-family.entity';
import { Repository } from 'typeorm';
import { CreateSamurdhiFamilyDto } from './dto/create-samurdhi-family.dto';
import { UpdateSamurdhiFamilyDto } from './dto/update-samurdhi-family.dto';
import { CurrentEmployment } from 'src/current-employment/entities/current-employment.entity';
import { District } from 'src/location/entities/district.entity';
import { Ds } from 'src/location/entities/ds.entity';
import { Zone } from 'src/location/entities/zone.entity';
import { Gnd } from 'src/location/entities/gnd.entity';
import { BeneficiaryStatus } from 'src/beneficiary-status/entities/beneficiary-status.entity';
import { SamurdhiSubsisdy } from 'src/samurdhi-subsidy/entities/samurdhi-subsidy.entity';
import { AswasumaCategory } from 'src/aswasuma-category/entities/aswasuma-category.entity';
import { EmpowermentDimension } from 'src/empowerment-dimension/entities/empowerment-dimension.entity';
import { ProjectType } from 'src/project-type/entities/project-type.entity';
import { Livelihood } from 'src/livelihoods/entities/livelihood.entity';
import { JobField } from 'src/job-field/entities/job-field.entity';
import { AuditService } from 'src/audit/audit.service';
import { Staff } from 'src/staff/entities/staff.entity';
import { CountBeneficiariesDto } from './dto/counts/count-beneficiaries.dto';
import { CountByEmpowermentDto } from './dto/counts/count-by-empowerment.dto';
import { ProjectDetailReportDto } from './dto/counts/project-detail-report.dto';
import { Disability } from 'src/disability/entities/disability.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SamurdhiFamilyService {
  constructor(
    @InjectRepository(SamurdhiFamily)
    private familyRepo: Repository<SamurdhiFamily>,
    private auditService: AuditService,
    @InjectRepository(Zone)
    private readonly zoneRepo: Repository<Zone>,

    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,

    @InjectRepository(Ds)
    private readonly dsRepo: Repository<Ds>,

    @InjectRepository(Gnd)
    private readonly gndRepo: Repository<Gnd>,
  ) { }

  async create(
    dto: CreateSamurdhiFamilyDto,
    staffId: string,
    consentLetterFile?: Express.Multer.File,
  ) {
    const staff = await this.familyRepo.manager.findOneByOrFail(Staff, {
      id: staffId,
    });

    // Check if a record already exists with the same NIC or Aswasuma Household Number
    const existingFamily = await this.familyRepo.findOne({
      where: [
        { nic: dto.nic },
        { aswasumaHouseholdNo: dto.aswasumaHouseholdNo },
      ],
    });

    if (existingFamily) {
      throw new Error(
        'A family with this NIC or Aswasuma Household Number already exists.',
      );
    }

    let consentLetterPath: string | undefined;
    if (consentLetterFile) {
      const uploadDir = './uploads/consent-letters';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${consentLetterFile.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, consentLetterFile.buffer);
      consentLetterPath = `${process.env.BACKEND_URL}/uploads/consent-letters/${fileName}`;
    }

    const otherSubsidyAmount =
      dto.otherSubsidyAmount && !isNaN(dto.otherSubsidyAmount)
        ? dto.otherSubsidyAmount
        : undefined;

    const family = this.familyRepo.create({
      district: dto.district_id
        ? ({ district_id: dto.district_id } as any)
        : undefined,
      divisionalSecretariat: dto.ds_id
        ? ({ ds_id: dto.ds_id } as any)
        : undefined,
      samurdhiBank: dto.zone_id
        ? ({ zone_id: dto.zone_id } as any)
        : undefined,
      gramaNiladhariDivision: dto.gnd_id
        ? ({ gnd_id: dto.gnd_id } as any)
        : undefined,

      mainProgram: dto.mainProgram,
      isImpactEvaluation: dto.isImpactEvaluation,
      hasConsentedToEmpowerment: dto.hasConsentedToEmpowerment,
      consentLetterPath: consentLetterPath,

      refusalReason: dto.refusal_reason_id
        ? { id: dto.refusal_reason_id }
        : undefined,
      consentGivenAt: dto.consentGivenAt
        ? new Date(dto.consentGivenAt)
        : undefined,

      beneficiaryType: dto.beneficiary_type_id
        ? ({
          beneficiary_type_id: dto.beneficiary_type_id,
        } as any)
        : undefined,

      areaClassification: dto.areaClassification,
      aswasumaHouseholdNo: dto.aswasumaHouseholdNo,
      nic: dto.nic,
      beneficiaryName: dto.beneficiaryName,
      beneficiaryAge: dto.beneficiaryAge,
      beneficiaryGender: dto.beneficiaryGender,
      address: dto.address,
      mobilePhone: dto.mobilePhone,
      telephone: dto.telephone,
      projectOwnerName: dto.projectOwnerName,
      projectOwnerAge: dto.projectOwnerAge,
      projectOwnerGender: dto.projectOwnerGender,
      hasDisability: dto.hasDisability,

      disability: dto.disability_id
        ? await this.familyRepo.manager.findOneBy(Disability, {
          disabilityId: dto.disability_id,
        })
        : null,

      maleBelow16: dto.maleBelow16,
      femaleBelow16: dto.femaleBelow16,
      male16To24: dto.male16To24,
      female16To24: dto.female16To24,
      male25To45: dto.male25To45,
      female25To45: dto.female25To45,
      male46To60: dto.male46To60,
      female46To60: dto.female46To60,
      maleAbove60: dto.maleAbove60,
      femaleAbove60: dto.femaleAbove60,

      currentEmployment: dto.employment_id
        ? ({ employment_id: dto.employment_id } as any)
        : undefined,

      otherOccupation: dto.otherOccupation,

      samurdhiSubsidy: dto.subsisdy_id
        ? ({ subsisdy_id: dto.subsisdy_id } as any)
        : undefined,

      aswasumaCategory: dto.aswesuma_cat_id
        ? ({ aswesuma_cat_id: dto.aswesuma_cat_id } as any)
        : undefined,

      empowermentDimension: dto.empowerment_dimension_id
        ? ({
          empowerment_dimension_id: dto.empowerment_dimension_id,
        } as any)
        : undefined,

      livelihood: dto.livelihood_id
        ? ({ id: dto.livelihood_id } as any)
        : undefined,

      projectType: dto.project_type_id
        ? ({ project_type_id: dto.project_type_id } as any)
        : undefined,

      otherProject: dto.otherProject,
      childName: dto.childName ?? null,
      childAge: dto.childAge ?? null,
      childGender: dto.childGender ?? null,

      jobField: dto.job_field_id
        ? ({ job_field_id: dto.job_field_id } as any)
        : undefined,

      otherJobField: dto.otherJobField,
      resource_id: dto.resource_id || [],
      monthlySaving: dto.monthlySaving,
      savingAmount: dto.savingAmount,
      health_indicator_id: dto.health_indicator_id || [],
      domestic_dynamic_id: dto.domestic_dynamic_id || [],
      community_participation_id: dto.community_participation_id || [],
      housing_service_id: dto.housing_service_id || [],
      commercialBankAccountName: dto.commercialBankAccountName,
      commercialBankAccountNumber: dto.commercialBankAccountNumber,
      commercialBankName: dto.commercialBankName,
      commercialBankBranch: dto.commercialBankBranch,
      samurdhiBankAccountName: dto.samurdhiBankAccountName,
      samurdhiBankAccountNumber: dto.samurdhiBankAccountNumber,
      samurdhiBankName: dto.samurdhiBankName,
      samurdhiBankAccountType: dto.samurdhiBankAccountType,
      wantsAswesumaBankTransfer: dto.wantsAswesumaBankTransfer,
      otherBankName: dto.otherBankName,
      otherBankBranch: dto.otherBankBranch,
      otherBankAccountHolder: dto.otherBankAccountHolder,
      otherBankAccountNumber: dto.otherBankAccountNumber,
      hasOtherGovernmentSubsidy: dto.hasOtherGovernmentSubsidy,
      otherGovernmentInstitution: dto.otherGovernmentInstitution,
      otherSubsidyAmount: otherSubsidyAmount,
      createdBy: staff,
    });

    const saved = await this.familyRepo.save(family);
    await this.auditService.log(
      'CREATE',
      'SamurdhiFamily',
      family.nic, // Using NIC as the entity ID
      staffId,
      null,
      saved,
    );

    return saved;
  }

  async findByNICOrHH(nicOrHh: string) {
    const family = await this.familyRepo.findOne({
      where: [{ nic: nicOrHh }, { aswasumaHouseholdNo: nicOrHh }],
      relations: [
        'district',
        'divisionalSecretariat',
        'samurdhiBank',
        'gramaNiladhariDivision',
        'beneficiaryType',
        'currentEmployment',
        'samurdhiSubsidy',
        'aswasumaCategory',
        'empowermentDimension',
        'livelihood',
        'projectType',
        'jobField',
        'disability',
      ],
    });

    if (!family) {
      return {
        message: 'No beneficiary family found for this NIC or HH number',
      };
    }

    // Helper function to get names for array fields
    const getNamesForIds = async (ids: string[], entityName: string) => {
      if (!ids || ids.length === 0) return [];

      const repo = this.familyRepo.manager.getRepository(entityName);
      const entities = await repo.findByIds(ids);
      return entities.map((e) => {
        // Determine the ID field name based on entity name
        let idField;
        if (entityName === 'resource_needed') idField = 'resource_id';
        else if (entityName === 'health_indicator')
          idField = 'health_indicator_id';
        else if (entityName === 'domestic_dynamic')
          idField = 'domestic_dynamic_id';
        else if (entityName === 'community_participation')
          idField = 'community_participation_id';
        else if (entityName === 'housing_basic_service')
          idField = 'housing_service_id';
        else idField = 'id'; // fallback

        return {
          id: e[idField], // Use the correct ID field
          nameEnglish: e.nameEnglish,
          nameSinhala: e.nameSinhala,
          nameTamil: e.nameTamil,
        };
      });
    };

    // Get names for array fields
    const [
      resourceNames,
      healthIndicatorNames,
      domesticDynamicNames,
      communityParticipationNames,
      housingServiceNames,
    ] = await Promise.all([
      getNamesForIds(family.resource_id || [], 'resource_needed'),
      getNamesForIds(family.health_indicator_id || [], 'health_indicator'),
      getNamesForIds(family.domestic_dynamic_id || [], 'domestic_dynamic'),
      getNamesForIds(
        family.community_participation_id || [],
        'community_participation',
      ),
      getNamesForIds(family.housing_service_id || [], 'housing_basic_service'),
    ]);

    return {
      beneficiaryDetails: {
        name: family.beneficiaryName,
        gender: family.beneficiaryGender,
        age: family.beneficiaryAge,
      },
      mainProgram: family.mainProgram,
      nic: family.nic,
      householdNumber: family.aswasumaHouseholdNo,
      address: family.address,
      mobilePhone: family.mobilePhone,
      telephone: family.telephone,
      projectOwnerDetails: {
        name: family.projectOwnerName,
        age: family.projectOwnerAge,
        gender: family.projectOwnerGender,
      },
      hasDisability: family.hasDisability,
      disability: family.disability
        ? {
          id: family.disability.disabilityId,
          nameEnglish: family.disability.nameEN,
          nameSinhala: family.disability.nameSi,
          nameTamil: family.disability.nameTa,
        }
        : null,
      noOfMembers: {
        male: {
          ageBelow16: family.maleBelow16,
          age16To24: family.male16To24,
          age25To45: family.male25To45,
          age46To60: family.male46To60,
          ageAbove60: family.maleAbove60,
          total:
            (family.maleBelow16 || 0) +
            (family.male16To24 || 0) +
            (family.male25To45 || 0) +
            (family.male46To60 || 0) +
            (family.maleAbove60 || 0),
        },
        female: {
          ageBelow16: family.femaleBelow16,
          age16To24: family.female16To24,
          age25To45: family.female25To45,
          age46To60: family.female46To60,
          ageAbove60: family.femaleAbove60,
          total:
            (family.femaleBelow16 || 0) +
            (family.female16To24 || 0) +
            (family.female25To45 || 0) +
            (family.female46To60 || 0) +
            (family.femaleAbove60 || 0),
        },
        overallTotal:
          (family.maleBelow16 || 0) +
          (family.male16To24 || 0) +
          (family.male25To45 || 0) +
          (family.male46To60 || 0) +
          (family.maleAbove60 || 0) +
          (family.femaleBelow16 || 0) +
          (family.female16To24 || 0) +
          (family.female25To45 || 0) +
          (family.female46To60 || 0) +
          (family.femaleAbove60 || 0),
      },
      hasConsentedToEmpowerment: family.hasConsentedToEmpowerment,
      consentLetterPath: family.consentLetterPath,
      refusalReason: family.refusalReason
        ? {
          id: family.refusalReason.id,
          reasonSinhala: family.refusalReason.reason_si,
          reasonEnglish: family.refusalReason.reason_en,
          reasonTamil: family.refusalReason.reason_ta,
        }
        : null,
      consentGivenAt: family.consentGivenAt,
      beneficiaryType: family.beneficiaryType
        ? {
          id: family.beneficiaryType.beneficiary_type_id,
          nameEnglish: family.beneficiaryType.nameEnglish,
          nameSinhala: family.beneficiaryType.nameSinhala,
          nameTamil: family.beneficiaryType.nameTamil,
        }
        : null,
      areaClassification: family.areaClassification,
      currentEmployment: family.currentEmployment
        ? {
          id: family.currentEmployment.employment_id,
          nameEnglish: family.currentEmployment.nameEnglish,
          nameSinhala: family.currentEmployment.nameSinhala,
          nameTamil: family.currentEmployment.nameTamil,
        }
        : null,
      otherOccupation: family.otherOccupation,
      samurdhiSubsidy: family.samurdhiSubsidy
        ? {
          id: family.samurdhiSubsidy.subsisdy_id,
          amount: family.samurdhiSubsidy.amount,
        }
        : null,
      aswasumaCategory: family.aswasumaCategory
        ? {
          id: family.aswasumaCategory.aswesuma_cat_id,
          nameEnglish: family.aswasumaCategory.nameEnglish,
          nameSinhala: family.aswasumaCategory.nameSinhala,
          nameTamil: family.aswasumaCategory.nameTamil,
        }
        : null,
      empowermentDimension: family.empowermentDimension
        ? {
          id: family.empowermentDimension.empowerment_dimension_id,
          nameEnglish: family.empowermentDimension.nameEnglish,
          nameSinhala: family.empowermentDimension.nameSinhala,
          nameTamil: family.empowermentDimension.nameTamil,
        }
        : null,
      livelihood: family.livelihood
        ? {
          id: family.livelihood.id,
          nameEnglish: family.livelihood.english_name,
          nameSinhala: family.livelihood.sinhala_name,
          nameTamil: family.livelihood.tamil_name,
        }
        : null,
      projectType: family.projectType
        ? {
          id: family.projectType.project_type_id,
          nameEnglish: family.projectType.nameEnglish,
          nameSinhala: family.projectType.nameSinhala,
          nameTamil: family.projectType.nameTamil,
        }
        : null,
      otherProject: family.otherProject,
      childName: family.childName,
      childAge: family.childAge,
      childGender: family.childGender,
      jobField: family.jobField
        ? {
          id: family.jobField.job_field_id,
          nameEnglish: family.jobField.nameEnglish,
          nameSinhala: family.jobField.nameSinhala,
          nameTamil: family.jobField.nameTamil,
        }
        : null,
      otherJobField: family.otherJobField,
      resources: resourceNames,
      monthlySaving: family.monthlySaving,
      savingAmount: family.savingAmount,
      healthIndicators: healthIndicatorNames,
      domesticDynamics: domesticDynamicNames,
      communityParticipations: communityParticipationNames,
      housingServices: housingServiceNames,
      // Added bank transfer preferences
      bankTransferPreferences: {
        wantsAswesumaBankTransfer: family.wantsAswesumaBankTransfer,
        otherBankDetails: {
          bankName: family.otherBankName,
          branch: family.otherBankBranch,
          accountHolder: family.otherBankAccountHolder,
          accountNumber: family.otherBankAccountNumber,
        },
      },
      // Added government subsidy information
      governmentSubsidy: {
        hasOtherGovernmentSubsidy: family.hasOtherGovernmentSubsidy,
        institution: family.otherGovernmentInstitution,
        amount: family.otherSubsidyAmount,
      },
      location: {
        district: family.district
          ? {
            id: family.district.district_id,
            name: family.district.district_name,
          }
          : null,
        divisionalSecretariat: family.divisionalSecretariat
          ? {
            id: family.divisionalSecretariat.ds_id,
            name: family.divisionalSecretariat.ds_name,
          }
          : null,
        samurdhiBank: family.samurdhiBank
          ? {
            id: family.samurdhiBank.zone_id,
            name: family.samurdhiBank.zone_name,
          }
          : null,
        gramaNiladhariDivision: family.gramaNiladhariDivision
          ? {
            id: family.gramaNiladhariDivision.gnd_id,
            name: family.gramaNiladhariDivision.gnd_name,
          }
          : null,
        commercialBankDetails: {
          accountName: family.commercialBankAccountName,
          accountNumber: family.commercialBankAccountNumber,
          bankName: family.commercialBankName,
          branch: family.commercialBankBranch,
        },
        samurdhiBankDetails: {
          accountName: family.samurdhiBankAccountName,
          accountNumber: family.samurdhiBankAccountNumber,
          bankName: family.samurdhiBankName,
          accountType: family.samurdhiBankAccountType,
        },
      },
    };
  }

  async updateByNICOrHH(
    nicOrHh: string,
    dto: UpdateSamurdhiFamilyDto,
    staffId: string,
  ) {
    const staff = await this.familyRepo.manager.findOneByOrFail(Staff, {
      id: staffId,
    });

    try {
      const family = await this.familyRepo.findOne({
        where: [{ nic: nicOrHh }, { aswasumaHouseholdNo: nicOrHh }],
        select: ['id', 'nic', 'aswasumaHouseholdNo'],
      });

      if (!family) {
        throw new NotFoundException(
          `Beneficiary family with NIC/HH number ${nicOrHh} not found`,
        );
      }

      // Get the current state before update for audit logging
      const oldState = await this.familyRepo.findOne({
        where: { id: family.id },
      });

      // Create an object with the updated fields
      const updateData: Partial<SamurdhiFamily> = {};

      // Helper function to ensure array format for JSON fields
      const ensureArray = (value: any): string[] | undefined => {
        if (value === undefined || value === null) return undefined;
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return [value];
        return [];
      };

      // Update basic info
      if (dto.district_id !== undefined)
        updateData.district = dto.district_id
          ? ({ district_id: dto.district_id } as District)
          : undefined;
      if (dto.ds_id !== undefined)
        updateData.divisionalSecretariat = dto.ds_id
          ? ({ ds_id: dto.ds_id } as Ds)
          : undefined;
      if (dto.zone_id !== undefined)
        updateData.samurdhiBank = dto.zone_id
          ? ({ zone_id: dto.zone_id } as Zone)
          : undefined;
      if (dto.gnd_id !== undefined)
        updateData.gramaNiladhariDivision = dto.gnd_id
          ? ({ gnd_id: dto.gnd_id } as Gnd)
          : undefined;

      if (dto.mainProgram !== undefined)
        updateData.mainProgram = dto.mainProgram;

      if (dto.isImpactEvaluation !== undefined) {
        updateData.isImpactEvaluation = dto.isImpactEvaluation;
      }

      if (dto.hasConsentedToEmpowerment !== undefined) {
        updateData.hasConsentedToEmpowerment = dto.hasConsentedToEmpowerment;
      }

      if (dto.consentGivenAt !== undefined) {
        updateData.consentGivenAt = dto.consentGivenAt
          ? new Date(dto.consentGivenAt)
          : undefined;
      }

      if (dto.beneficiary_type_id !== undefined)
        updateData.beneficiaryType = dto.beneficiary_type_id
          ? ({
            beneficiary_type_id: dto.beneficiary_type_id,
          } as BeneficiaryStatus)
          : undefined;

      if (dto.areaClassification !== undefined) {
        updateData.areaClassification = dto.areaClassification;
      }

      // Basic field updates
      if (dto.aswasumaHouseholdNo !== undefined)
        updateData.aswasumaHouseholdNo = dto.aswasumaHouseholdNo;
      if (dto.nic !== undefined) updateData.nic = dto.nic;
      if (dto.beneficiaryName !== undefined)
        updateData.beneficiaryName = dto.beneficiaryName;
      if (dto.beneficiaryGender !== undefined)
        if (dto.beneficiaryAge !== undefined)
          updateData.beneficiaryAge = dto.beneficiaryAge;
      updateData.beneficiaryGender = dto.beneficiaryGender;
      if (dto.address !== undefined) updateData.address = dto.address;
      if (dto.mobilePhone !== undefined)
        updateData.mobilePhone = dto.mobilePhone;
      if (dto.telephone !== undefined) updateData.telephone = dto.telephone;

      if (dto.projectOwnerName !== undefined)
        updateData.projectOwnerName = dto.projectOwnerName;
      if (dto.projectOwnerAge !== undefined)
        updateData.projectOwnerAge = dto.projectOwnerAge;
      if (dto.projectOwnerGender !== undefined)
        updateData.projectOwnerGender = dto.projectOwnerGender;

      if (dto.hasDisability !== undefined) {
        updateData.hasDisability = dto.hasDisability;
      }

      if (dto.disability_id !== undefined) {
        updateData.disability = dto.disability_id
          ? await this.familyRepo.manager.findOneBy(Disability, {
            disabilityId: dto.disability_id,
          })
          : null;
      }

      // Update age group fields (fixed to match create function)
      if (dto.maleBelow16 !== undefined)
        updateData.maleBelow16 = dto.maleBelow16;
      if (dto.femaleBelow16 !== undefined)
        updateData.femaleBelow16 = dto.femaleBelow16;

      if (dto.male16To24 !== undefined) updateData.male16To24 = dto.male16To24;
      if (dto.female16To24 !== undefined)
        updateData.female16To24 = dto.female16To24;

      if (dto.male25To45 !== undefined) updateData.male25To45 = dto.male25To45;
      if (dto.female25To45 !== undefined)
        updateData.female25To45 = dto.female25To45;

      if (dto.male46To60 !== undefined) updateData.male46To60 = dto.male46To60;
      if (dto.female46To60 !== undefined)
        updateData.female46To60 = dto.female46To60;

      if (dto.maleAbove60 !== undefined)
        updateData.maleAbove60 = dto.maleAbove60;
      if (dto.femaleAbove60 !== undefined)
        updateData.femaleAbove60 = dto.femaleAbove60;

      // Update employment info
      if (dto.employment_id !== undefined)
        updateData.currentEmployment = dto.employment_id
          ? ({ employment_id: dto.employment_id } as CurrentEmployment)
          : undefined;

      if (dto.otherOccupation !== undefined)
        updateData.otherOccupation = dto.otherOccupation;

      if (dto.subsisdy_id !== undefined)
        updateData.samurdhiSubsidy = dto.subsisdy_id
          ? ({ subsisdy_id: dto.subsisdy_id } as SamurdhiSubsisdy)
          : undefined;

      if (dto.aswesuma_cat_id !== undefined)
        updateData.aswasumaCategory = dto.aswesuma_cat_id
          ? ({ aswesuma_cat_id: dto.aswesuma_cat_id } as AswasumaCategory)
          : undefined;

      if (dto.empowerment_dimension_id !== undefined)
        updateData.empowermentDimension = dto.empowerment_dimension_id
          ? ({
            empowerment_dimension_id: dto.empowerment_dimension_id,
          } as EmpowermentDimension)
          : undefined;

      // Update project info
      if (dto.livelihood_id !== undefined)
        updateData.livelihood = dto.livelihood_id
          ? ({ id: dto.livelihood_id } as Livelihood)
          : undefined;

      if (dto.project_type_id !== undefined)
        updateData.projectType = dto.project_type_id
          ? ({ project_type_id: dto.project_type_id } as ProjectType)
          : undefined;

      if (dto.otherProject !== undefined)
        updateData.otherProject = dto.otherProject;

      // Update child info
      if (dto.childName !== undefined) updateData.childName = dto.childName ?? null;
      if (dto.childAge !== undefined) updateData.childAge = dto.childAge ?? null;
      if (dto.childGender !== undefined) updateData.childGender = dto.childGender ?? null;

      if (dto.job_field_id !== undefined)
        updateData.jobField = dto.job_field_id
          ? ({ job_field_id: dto.job_field_id } as JobField)
          : undefined;

      if (dto.otherJobField !== undefined)
        updateData.otherJobField = dto.otherJobField;

      // Update array fields with proper validation
      if (dto.resource_id !== undefined)
        updateData.resource_id = ensureArray(dto.resource_id);

      if (dto.monthlySaving !== undefined)
        updateData.monthlySaving = dto.monthlySaving;

      if (dto.savingAmount !== undefined)
        updateData.savingAmount = dto.savingAmount;

      if (dto.health_indicator_id !== undefined)
        updateData.health_indicator_id = ensureArray(dto.health_indicator_id);

      if (dto.domestic_dynamic_id !== undefined)
        updateData.domestic_dynamic_id = ensureArray(dto.domestic_dynamic_id);

      if (dto.community_participation_id !== undefined)
        updateData.community_participation_id = ensureArray(
          dto.community_participation_id,
        );

      if (dto.housing_service_id !== undefined)
        updateData.housing_service_id = ensureArray(dto.housing_service_id);

      // Update bank details
      if (dto.commercialBankAccountName !== undefined)
        updateData.commercialBankAccountName = dto.commercialBankAccountName;
      if (dto.commercialBankAccountNumber !== undefined)
        updateData.commercialBankAccountNumber =
          dto.commercialBankAccountNumber;
      if (dto.commercialBankName !== undefined)
        updateData.commercialBankName = dto.commercialBankName;
      if (dto.commercialBankBranch !== undefined)
        updateData.commercialBankBranch = dto.commercialBankBranch;

      if (dto.samurdhiBankAccountName !== undefined)
        updateData.samurdhiBankAccountName = dto.samurdhiBankAccountName;
      if (dto.samurdhiBankAccountNumber !== undefined)
        updateData.samurdhiBankAccountNumber = dto.samurdhiBankAccountNumber;
      if (dto.samurdhiBankName !== undefined)
        updateData.samurdhiBankName = dto.samurdhiBankName;
      if (dto.samurdhiBankAccountType !== undefined)
        updateData.samurdhiBankAccountType = dto.samurdhiBankAccountType;

      // Add the new bank transfer and subsidy fields
      if (dto.wantsAswesumaBankTransfer !== undefined)
        updateData.wantsAswesumaBankTransfer = dto.wantsAswesumaBankTransfer;

      if (dto.otherBankName !== undefined)
        updateData.otherBankName = dto.otherBankName;

      if (dto.otherBankBranch !== undefined)
        updateData.otherBankBranch = dto.otherBankBranch;

      if (dto.otherBankAccountHolder !== undefined)
        updateData.otherBankAccountHolder = dto.otherBankAccountHolder;

      if (dto.otherBankAccountNumber !== undefined)
        updateData.otherBankAccountNumber = dto.otherBankAccountNumber;

      if (dto.hasOtherGovernmentSubsidy !== undefined)
        updateData.hasOtherGovernmentSubsidy = dto.hasOtherGovernmentSubsidy;

      if (dto.otherGovernmentInstitution !== undefined)
        updateData.otherGovernmentInstitution = dto.otherGovernmentInstitution;

      if (dto.otherSubsidyAmount !== undefined)
        updateData.otherSubsidyAmount = dto.otherSubsidyAmount;

      // Perform the update using raw query to bypass JSON parsing issues
      const updateResult = await this.familyRepo
        .createQueryBuilder()
        .update(SamurdhiFamily)
        .set(updateData)
        .where('id = :id', { id: family.id })
        .execute();

      if (updateResult.affected === 0) {
        throw new Error('Update failed - no rows affected');
      }

      // Get the updated entity for audit logging
      const newState = await this.familyRepo.findOne({
        where: { id: family.id },
      });

      await this.auditService.log(
        'UPDATE',
        'SamurdhiFamily',
        family.nic,
        staffId,
        oldState,
        newState,
      );

      // Return the updated family (with error handling for JSON fields)
      try {
        return await this.familyRepo.findOne({
          where: { id: family.id },
          relations: [
            'district',
            'divisionalSecretariat',
            'samurdhiBank',
            'gramaNiladhariDivision',
            'beneficiaryType',
            'currentEmployment',
            'samurdhiSubsidy',
            'aswasumaCategory',
            'empowermentDimension',
            'projectType',
            'jobField',
            'disability',
          ],
        });
      } catch (jsonError) {
        // If there are still JSON parsing issues, return a minimal response
        console.error('JSON parsing error on return:', jsonError);
        return {
          id: family.id,
          message:
            'Update successful, but some JSON fields may have formatting issues',
          warning: 'Please check the JSON fields in the database',
        };
      }
    } catch (error) {
      console.error('Update error:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      // Check if it's a JSON parsing error
      if (
        error.message.includes('JSON') ||
        error.message.includes('Exponent')
      ) {
        throw new Error(
          `JSON parsing error: The database contains invalid JSON data. Please run database cleanup first. Original error: ${error.message}`,
        );
      }

      throw new Error(`Update failed: ${error.message}`);
    }
  }

  async countBeneficiaries(filters: CountBeneficiariesDto) {
    const query = this.familyRepo
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.gramaNiladhariDivision', 'gnd')
      .leftJoinAndSelect('family.samurdhiBank', 'zone')
      .leftJoinAndSelect('family.divisionalSecretariat', 'ds')
      .leftJoinAndSelect('family.district', 'district');

    // Apply filters
    if (filters.district_id) {
      query.andWhere('district.district_id = :district_id', {
        district_id: filters.district_id,
      });
    }

    if (filters.ds_id) {
      query.andWhere('ds.ds_id = :ds_id', { ds_id: filters.ds_id });
    }

    if (filters.zone_id) {
      query.andWhere('zone.zone_id = :zone_id', { zone_id: filters.zone_id });
    }

    if (filters.gnd_id) {
      query.andWhere('gnd.gnd_id = :gnd_id', { gnd_id: filters.gnd_id });
    }

    if (filters.mainProgram) {
      query.andWhere('family.mainProgram = :mainProgram', {
        mainProgram: filters.mainProgram,
      });
    }

    // Group by GND and get counts
    const results = await query
      .select([
        'gnd.gnd_id as gndId',
        'gnd.gnd_name as gndName',
        'zone.zone_name as zoneName',
        'ds.ds_name as dsName',
        'district.district_name as districtName',
        'COUNT(family.id) as count',
      ])
      .groupBy(
        'gnd.gnd_id, gnd.gnd_name, zone.zone_name, ds.ds_name, district.district_name',
      )
      .orderBy('district.district_name')
      .addOrderBy('ds.ds_name')
      .addOrderBy('zone.zone_name')
      .addOrderBy('gnd.gnd_name')
      .getRawMany();

    // Calculate total count
    const totalCount = results.reduce(
      (sum, item) => sum + parseInt(item.count),
      0,
    );

    return {
      results,
      totalCount,
    };
  }

  async countByEmpowerment(filters: CountByEmpowermentDto) {
    const query = this.familyRepo
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.gramaNiladhariDivision', 'gnd')
      .leftJoinAndSelect('family.samurdhiBank', 'zone')
      .leftJoinAndSelect('family.divisionalSecretariat', 'ds')
      .leftJoinAndSelect('family.district', 'district')
      .leftJoinAndSelect('family.empowermentDimension', 'empowerment');

    // Apply location filters
    if (filters.district_id) {
      query.andWhere('district.district_id = :district_id', {
        district_id: filters.district_id,
      });
    }

    if (filters.ds_id) {
      query.andWhere('ds.ds_id = :ds_id', { ds_id: filters.ds_id });
    }

    if (filters.zone_id) {
      query.andWhere('zone.zone_id = :zone_id', { zone_id: filters.zone_id });
    }

    if (filters.gnd_id) {
      query.andWhere('gnd.gnd_id = :gnd_id', { gnd_id: filters.gnd_id });
    }

    // Apply empowerment dimension filter
    if (filters.empowerment_dimension_id) {
      query.andWhere(
        'empowerment.empowerment_dimension_id = :empowerment_dimension_id',
        {
          empowerment_dimension_id: filters.empowerment_dimension_id,
        },
      );
    }

    // Group by both GND and empowerment dimension
    const results = await query
      .select([
        'gnd.gnd_id as gndId',
        'gnd.gnd_name as gndName',
        'zone.zone_name as zoneName',
        'ds.ds_name as dsName',
        'district.district_name as districtName',
        'empowerment.empowerment_dimension_id as empowermentId',
        'empowerment.nameEnglish as empowermentName',
        'COUNT(family.id) as count',
      ])
      .groupBy(
        'gnd.gnd_id, gnd.gnd_name, zone.zone_name, ds.ds_name, district.district_name, empowerment.empowerment_dimension_id, empowerment.nameEnglish',
      )
      .orderBy('district.district_name')
      .addOrderBy('ds.ds_name')
      .addOrderBy('zone.zone_name')
      .addOrderBy('gnd.gnd_name')
      .addOrderBy('empowerment.nameEnglish')
      .getRawMany();

    // Calculate total count
    const totalCount = results.reduce(
      (sum, item) => sum + parseInt(item.count),
      0,
    );

    return {
      results,
      totalCount,
    };
  }

  async getProjectDetailReport(filters: ProjectDetailReportDto, user: any) {
    // First get the accessible locations based on user role
    const accessibleLocations = await this.getAccessibleLocations(user);

    // Then get the project details with the same filters
    const projectDetails = await this.getFilteredProjectDetails(filters, user);

    return {
      accessibleLocations,
      projectDetails,
    };
  }

  async getAccessibleLocations(user: any) {
    if (!user) throw new Error('User object is missing');
    if (!user.role?.name) throw new Error('User role information is missing');
    if (!user.locationCode && user.role.name !== 'National Level User') {
      throw new Error('User location information is missing');
    }

    const locationParts = user.locationCode?.split('-') || [];
    const toDbId = (part: string) => parseInt(part, 10).toString();

    switch (user.role.name) {
      case 'GN Level User': {
        const gnd = await this.gndRepo.findOne({
          where: { id: user.locationCode },
          select: ['gnd_id', 'gnd_name', 'zone_id', 'id'],
        });
        if (!gnd)
          throw new Error(
            `GN Division not found for code ${user.locationCode}`,
          );

        return {
          districts: [],
          dss: [],
          zones: [],
          gndDivisions: [gnd],
        };
      }

      case 'Bank/Zone Level User': {
        const zone = await this.zoneRepo.findOne({
          where: { id: user.locationCode.split('-').slice(0, 4).join('-') },
          select: ['zone_id', 'zone_name', 'ds_id', 'id'],
        });
        if (!zone)
          throw new Error(`Zone not found for code ${user.locationCode}`);

        return {
          districts: await this.getDistrictByZone(zone.zone_id),
          dss: await this.getDsByZone(zone.zone_id),
          zones: [zone],
          gndDivisions: await this.getGndsByZone(zone.zone_id),
        };
      }

      case 'Divisional Level User': {
        const ds = await this.dsRepo.findOne({
          where: { id: user.locationCode.split('-').slice(0, 3).join('-') },
          select: ['ds_id', 'ds_name', 'district_id', 'id'],
        });
        if (!ds) throw new Error(`DS not found for code ${user.locationCode}`);

        return {
          districts: await this.getDistrictByDs(ds.ds_id),
          dss: [ds],
          zones: await this.getZonesByDs(ds.ds_id),
          gndDivisions: await this.getGndsByDs(ds.ds_id),
        };
      }

      case 'District Level User': {
        const district = await this.districtRepo.findOne({
          where: { id: user.locationCode.split('-').slice(0, 2).join('-') },
          select: ['district_id', 'district_name', 'province_id', 'id'],
        });
        if (!district)
          throw new Error(`District not found for code ${user.locationCode}`);

        return {
          districts: [district],
          dss: await this.getDssByDistrict(district.district_id),
          zones: await this.getZonesByDistrict(district.district_id),
          gndDivisions: await this.getGndsByDistrict(district.district_id),
        };
      }

      case 'National Level User':
        return {
          districts: await this.getAllDistricts(),
          dss: await this.getAllDss(),
          zones: await this.getAllZones(),
          gndDivisions: await this.getAllGnds(),
        };

      default:
        throw new Error(`Unknown user role: ${user.role.name}`);
    }
  }

  // Helper methods for each query
  private async getDistrictById(id: string) {
    return this.districtRepo.findOne({
      where: { district_id: id },
      select: ['district_id', 'district_name', 'province_id'],
    });
  }

  private async getDsById(id: string) {
    return this.dsRepo.findOne({
      where: { ds_id: id },
      select: ['ds_id', 'ds_name', 'district_id'],
    });
  }

  private async getZoneById(id: string) {
    return this.zoneRepo.findOne({
      where: { zone_id: id },
      select: ['zone_id', 'zone_name', 'ds_id'],
    });
  }

  private async getGndsById(id: string) {
    return this.gndRepo.find({
      where: { gnd_id: id },
      select: ['gnd_id', 'gnd_name', 'zone_id'],
    });
  }

  private async getDistrictByZone(zoneId: string) {
    return this.districtRepo
      .createQueryBuilder('d')
      .select(['d.district_id', 'd.district_name', 'd.province_id'])
      .innerJoin(Ds, 'ds', 'ds.district_id = d.district_id')
      .innerJoin(Zone, 'z', 'z.ds_id = ds.ds_id')
      .where('z.zone_id = :zoneId', { zoneId })
      .getMany();
  }

  private async getDsByZone(zoneId: string) {
    return this.dsRepo
      .createQueryBuilder('ds')
      .select(['ds.ds_id', 'ds.ds_name', 'ds.district_id'])
      .innerJoin(Zone, 'z', 'z.ds_id = ds.ds_id')
      .where('z.zone_id = :zoneId', { zoneId })
      .getMany();
  }

  private async getGndsByZone(zoneId: string) {
    return this.gndRepo.find({
      where: { zone_id: zoneId },
      select: ['gnd_id', 'gnd_name', 'zone_id'],
    });
  }

  private async getDistrictByDs(dsId: string) {
    return this.districtRepo
      .createQueryBuilder('d')
      .select(['d.district_id', 'd.district_name', 'd.province_id'])
      .innerJoin(Ds, 'ds', 'ds.district_id = d.district_id')
      .where('ds.ds_id = :dsId', { dsId })
      .getMany();
  }

  private async getZonesByDs(dsId: string) {
    return this.zoneRepo.find({
      where: { ds_id: dsId },
      select: ['zone_id', 'zone_name', 'ds_id'],
    });
  }

  private async getGndsByDs(dsId: string) {
    return this.gndRepo
      .createQueryBuilder('gnd')
      .select(['gnd.gnd_id', 'gnd.gnd_name', 'gnd.zone_id'])
      .innerJoin(Zone, 'z', 'z.zone_id = gnd.zone_id')
      .where('z.ds_id = :dsId', { dsId })
      .getMany();
  }

  private async getDssByDistrict(districtId: string) {
    return this.dsRepo.find({
      where: { district_id: districtId },
      select: ['ds_id', 'ds_name', 'district_id'],
    });
  }

  private async getZonesByDistrict(districtId: string) {
    return this.zoneRepo
      .createQueryBuilder('z')
      .select(['z.zone_id', 'z.zone_name', 'z.ds_id'])
      .innerJoin(Ds, 'ds', 'ds.ds_id = z.ds_id')
      .where('ds.district_id = :districtId', { districtId })
      .getMany();
  }

  private async getGndsByDistrict(districtId: string) {
    return this.gndRepo
      .createQueryBuilder('gnd')
      .select(['gnd.gnd_id', 'gnd.gnd_name', 'gnd.zone_id'])
      .innerJoin(Zone, 'z', 'z.zone_id = gnd.zone_id')
      .innerJoin(Ds, 'ds', 'ds.ds_id = z.ds_id')
      .where('ds.district_id = :districtId', { districtId })
      .getMany();
  }

  private async getAllDistricts() {
    return this.districtRepo.find({
      select: ['district_id', 'district_name', 'province_id'],
    });
  }

  private async getAllDss() {
    return this.dsRepo.find({
      select: ['ds_id', 'ds_name', 'district_id'],
    });
  }

  private async getAllZones() {
    return this.zoneRepo.find({
      select: ['zone_id', 'zone_name', 'ds_id'],
    });
  }

  private async getAllGnds() {
    return this.gndRepo.find({
      select: ['gnd_id', 'gnd_name', 'zone_id'],
    });
  }

  async getFilteredProjectDetails(filters: ProjectDetailReportDto, user: any) {
    const query = this.familyRepo
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.gramaNiladhariDivision', 'gnd')
      .leftJoinAndSelect('family.samurdhiBank', 'zone')
      .leftJoinAndSelect('family.divisionalSecretariat', 'ds')
      .leftJoinAndSelect('family.district', 'district')
      .leftJoinAndSelect('family.beneficiaryType', 'beneficiaryType');

    // Apply role-based filtering
    if (user.role.name !== 'National Level User') {
      const locationParts = user.locationCode.split('-');

      // First, let's find the actual IDs from the location tables
      // based on the location code parts
      switch (user.role.name) {
        case 'GN Level User':
          // For GN level, we need to find the GND by its code
          const gndCode = user.locationCode;
          const gnd = await this.gndRepo.findOne({
            where: { id: gndCode }, // assuming id field stores the full code like '1-1-09-03-175'
          });
          if (gnd) {
            query.andWhere('family.gnd_id = :gndId', { gndId: gnd.gnd_id });
          }
          break;

        case 'Bank/Zone Level User':
          // For zone level, find zone by its code
          const zoneCode = locationParts.slice(0, 4).join('-'); // '1-1-09-03'
          const zone = await this.zoneRepo.findOne({
            where: { id: zoneCode },
          });
          if (zone) {
            query.andWhere('family.zone_id = :zoneId', {
              zoneId: zone.zone_id,
            });
          }
          break;

        case 'Divisional Level User':
          // For DS level, find DS by its code
          const dsCode = locationParts.slice(0, 3).join('-'); // '1-1-09'
          const ds = await this.dsRepo.findOne({
            where: { id: dsCode },
          });
          if (ds) {
            query.andWhere('family.ds_id = :dsId', { dsId: ds.ds_id });
          }
          break;

        case 'District Level User':
          // For district level, find district by its code
          const districtCode = locationParts.slice(0, 2).join('-'); // '1-1'
          const district = await this.districtRepo.findOne({
            where: { id: districtCode },
          });
          if (district) {
            query.andWhere('family.district_id = :districtId', {
              districtId: district.district_id,
            });
          }
          break;
      }
    }

    // Apply additional filters (rest of your code remains the same)
    if (filters.district_id) {
      query.andWhere('family.district_id = :district_id', {
        district_id: filters.district_id,
      });
    }
    if (filters.ds_id) {
      query.andWhere('family.ds_id = :ds_id', {
        ds_id: filters.ds_id,
      });
    }
    if (filters.zone_id) {
      query.andWhere('family.zone_id = :zone_id', {
        zone_id: filters.zone_id,
      });
    }
    if (filters.gnd_id) {
      query.andWhere('family.gnd_id = :gnd_id', {
        gnd_id: filters.gnd_id,
      });
    }
    if (filters.mainProgram) {
      query.andWhere('family.mainProgram = :mainProgram', {
        mainProgram: filters.mainProgram,
      });
    }

    return await query
      .select([
        // Family details
        'family.id as family_id',
        'family.beneficiaryName as family_beneficiaryName',
        'family.beneficiaryGender as family_beneficiaryGender',
        'family.address as family_address',
        'family.mainProgram as family_mainProgram',
        'family.aswasumaHouseholdNo as hh_number',
        'family.nic as nic',
        'family.hasConsentedToEmpowerment as hasConsentedToEmpowerment',

        // Beneficiary type
        'beneficiaryType.nameEnglish as category',

        // Location IDs and Names
        'district.district_id as district_id',
        'district.district_name as district_name',
        'ds.ds_id as ds_id',
        'ds.ds_name as ds_name',
        'zone.zone_id as zone_id',
        'zone.zone_name as zone_name',
        'gnd.gnd_id as gnd_id',
        'gnd.gnd_name as gnd_name',
      ])
      .orderBy('district.district_name')
      .addOrderBy('ds.ds_name')
      .addOrderBy('zone.zone_name')
      .addOrderBy('gnd.gnd_name')
      .addOrderBy('family.beneficiaryName')
      .getRawMany();
  }

  async findAllByCreator(
    staffId: string,
    filters: {
      mainProgram?: MainProgram;
      beneficiaryType?: string;
      fromDate?: Date;
      toDate?: Date;
      search?: string;
    } = {},
    page: number = 1,
    limit: number = 10,
  ) {
    const query = this.familyRepo
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.district', 'district')
      .leftJoinAndSelect('family.divisionalSecretariat', 'ds')
      .leftJoinAndSelect('family.samurdhiBank', 'zone')
      .leftJoinAndSelect('family.gramaNiladhariDivision', 'gnd')
      .leftJoinAndSelect('family.beneficiaryType', 'beneficiaryType')
      .leftJoinAndSelect('family.currentEmployment', 'currentEmployment')
      .leftJoinAndSelect('family.samurdhiSubsidy', 'samurdhiSubsidy')
      .leftJoinAndSelect('family.aswasumaCategory', 'aswasumaCategory')
      .leftJoinAndSelect('family.empowermentDimension', 'empowermentDimension')
      .leftJoinAndSelect('family.projectType', 'projectType')
      .leftJoinAndSelect('family.jobField', 'jobField')
      .leftJoinAndSelect('family.createdBy', 'createdBy')
      .leftJoinAndSelect('family.disability', 'disability')
      .where('family.created_by = :staffId', { staffId });

    // Apply filters
    if (filters.mainProgram) {
      query.andWhere('family.mainProgram = :mainProgram', {
        mainProgram: filters.mainProgram,
      });
    }

    if (filters.beneficiaryType) {
      query.andWhere('beneficiaryType.beneficiary_type_id = :beneficiaryType', {
        beneficiaryType: filters.beneficiaryType,
      });
    }

    if (filters.fromDate) {
      query.andWhere('family.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }

    if (filters.toDate) {
      query.andWhere('family.createdAt <= :toDate', {
        toDate: new Date(filters.toDate.setHours(23, 59, 59, 999)), // End of day
      });
    }

    if (filters.search) {
      query.andWhere(
        '(family.beneficiaryName LIKE :search OR family.nic LIKE :search OR family.mobilePhone LIKE :search OR family.aswasumaHouseholdNo LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const [results, total] = await query
      .orderBy('family.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: results.map((family) => ({
        id: family.id,
        beneficiaryName: family.beneficiaryName,
        beneficiaryAge: family.beneficiaryAge,
        aswasumaHouseholdNo: family.aswasumaHouseholdNo,
        nic: family.nic,
        mobilePhone: family.mobilePhone,
        telephone: family.telephone,
        address: family.address,
        district: family.district?.district_name,
        ds: family.divisionalSecretariat?.ds_name,
        zone: family.samurdhiBank?.zone_name,
        gnd: family.gramaNiladhariDivision?.gnd_name,
        beneficiaryType: family.beneficiaryType?.nameEnglish,
        currentEmployment: family.currentEmployment?.nameEnglish,
        hasDisability: family.hasDisability,
        disability: family.disability
          ? {
            id: family.disability.disabilityId,
            nameEnglish: family.disability.nameEN,
          }
          : null,
        mainProgram: family.mainProgram,
      })),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async getCountReport(filters: CountBeneficiariesDto, user: any) {
    // First get the accessible locations based on user role
    const accessibleLocations = await this.getAccessibleLocations(user);

    // Then get the count data with the same filters
    const countData = await this.countBeneficiaries(filters);

    return {
      accessibleLocations,
      countData,
    };
  }

  async getEmpowermentCountReport(filters: CountByEmpowermentDto, user: any) {
    // First get the accessible locations based on user role
    const accessibleLocations = await this.getAccessibleLocations(user);

    // Then get the count data with the same filters
    const countData = await this.countByEmpowerment(filters);

    return {
      accessibleLocations,
      countData,
    };
  }

  async getFamiliesByLocation(filters: {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      district_id,
      ds_id,
      zone_id,
      gnd_id,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.familyRepo
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.district', 'district')
      .leftJoinAndSelect('family.divisionalSecretariat', 'ds')
      .leftJoinAndSelect('family.samurdhiBank', 'zone')
      .leftJoinAndSelect('family.gramaNiladhariDivision', 'gnd')
      .leftJoinAndSelect('family.beneficiaryType', 'beneficiaryType')
      .leftJoinAndSelect('family.currentEmployment', 'currentEmployment');

    // Apply location filters
    if (district_id) {
      query.andWhere('family.district_id = :district_id', { district_id });
    }

    if (ds_id) {
      query.andWhere('family.ds_id = :ds_id', { ds_id });
    }

    if (zone_id) {
      query.andWhere('family.zone_id = :zone_id', { zone_id });
    }

    if (gnd_id) {
      query.andWhere('family.gnd_id = :gnd_id', { gnd_id });
    }

    const [results, total] = await query
      .orderBy('family.beneficiaryName', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: results.map((family) => ({
        id: family.id,
        beneficiaryName: family.beneficiaryName,
        beneficiaryAge: family.beneficiaryAge,
        nic: family.nic,
        mobilePhone: family.mobilePhone,
        telephone: family.telephone,
        address: family.address,
        district: family.district?.district_name,
        ds: family.divisionalSecretariat?.ds_name,
        zone: family.samurdhiBank?.zone_name,
        gnd: family.gramaNiladhariDivision?.gnd_name,
        beneficiaryType: family.beneficiaryType?.nameEnglish,
        currentEmployment: family.currentEmployment?.nameEnglish,
        mainProgram: family.mainProgram,
        createdAt: family.createdAt,
      })),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async checkExistsByHousehold(householdNo: string) {
    const existing = await this.familyRepo.findOne({
      where: { aswasumaHouseholdNo: householdNo },
      select: ['id', 'beneficiaryName', 'aswasumaHouseholdNo'],
    });

    if (existing) {
      return {
        exists: true,
        message: `A beneficiary record with household number ${householdNo} already exists in the system.`,
        beneficiaryName: existing.beneficiaryName,
      };
    }

    return { exists: false };
  }

  async checkExistsByNic(nic: string) {
    const existing = await this.familyRepo.findOne({
      where: { nic },
      select: ['id', 'beneficiaryName', 'nic'],
    });

    if (existing) {
      return {
        exists: true,
        message: `A beneficiary record with NIC ${nic} already exists in the system.`,
        beneficiaryName: existing.beneficiaryName,
      };
    }

    return { exists: false };
  }
}
