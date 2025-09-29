export class BeneficiaryDetailsResponseDto {
  id: string;
  aswasumaHouseholdNo?: string;
  nic: string;
  beneficiaryName: string;
  beneficiaryAge?: number;
  beneficiaryGender: string;
  address: string;
  mobilePhone: string;
  telephone?: string;
  projectOwnerName?: string;
  projectOwnerAge?: number;
  projectOwnerGender?: string;
  hasDisability?: boolean;
  hasConsentedToEmpowerment?: boolean;
  isImpactEvaluation?: boolean;
  consentGivenAt?: Date;
  mainProgram?: string;
  areaClassification?: string;
  monthlySaving: boolean;
  savingAmount?: number;
  hasOtherGovernmentSubsidy?: boolean;
  otherGovernmentInstitution?: string;
  otherSubsidyAmount?: number;
  createdAt: Date;

  location: {
    district?: {
      district_id: string;
      district_name: string;
    };
    ds?: {
      ds_id: string;
      ds_name: string;
    };
    zone?: {
      zone_id: string;
      zone_name: string;
    };
    gnd?: {
      gnd_id: string;
      gnd_name: string;
    };
  };

  demographics: {
    totalFamilyMembers: number;
    totalMale: number;
    totalFemale: number;
    ageRanges: {
      below16: {
        male: number;
        female: number;
        total: number;
      };
      age16To24: {
        male: number;
        female: number;
        total: number;
      };
      age25To45: {
        male: number;
        female: number;
        total: number;
      };
      age46To60: {
        male: number;
        female: number;
        total: number;
      };
      above60: {
        male: number;
        female: number;
        total: number;
      };
    };
  };

  beneficiaryType?: {
    beneficiary_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };

  disability?: {
    disability_id: number;
    nameEN: string;
    nameSi: string;
    nameTa: string;
  };

  currentEmployment?: {
    employment_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };

  samurdhiSubsidy?: {
    subsisdy_id: string;
    amount: number;
  };

  aswasumaCategory?: {
    aswesuma_cat_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };

  empowermentDimension?: {
    empowerment_dimension_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };

  refusalReason?: {
    id: number;
    reason_si: string;
    reason_en: string;
    reason_ta: string;
  };

  livelihood?: {
    id: number;
    english_name: string;
    sinhala_name: string;
    tamil_name: string;
  };

  projectType?: {
    project_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };

  jobField?: {
    job_field_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };

  bankDetails: {
    commercial?: {
      accountName?: string;
      accountNumber?: string;
      bankName?: string;
      branch?: string;
    };
    samurdhi?: {
      accountName?: string;
      accountNumber?: string;
      bankName?: string;
      accountType?: string;
    };
    other?: {
      bankName?: string;
      branch?: string;
      accountHolder?: string;
      accountNumber?: string;
    };
    wantsAswesumaBankTransfer?: boolean;
  };

  childDetails?: {
    childName?: string;
    childAge?: number;
    childGender?: string;
  };

  otherOccupation?: string;
  otherProject?: string;
  otherJobField?: string;
  resource_id?: string[];
  health_indicator_id?: string[];
  domestic_dynamic_id?: string[];
  community_participation_id?: string[];
  housing_service_id?: string[];

  createdBy?: {
    staff_id: string;
    staffName: string;
    role: string;
  };
}
