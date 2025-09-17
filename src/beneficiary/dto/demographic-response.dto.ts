export class DemographicResponseDto {
  district: {
    district_id: string;
    district_name: string;
  };

  ds: {
    ds_id: string;
    ds_name: string;
  };

  zone: {
    zone_id: string;
    zone_name: string;
  };

  gnd: {
    gnd_id: string;
    gnd_name: string;
  };

  mainProgram: string;
  projectOwnerName: string;

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
}
