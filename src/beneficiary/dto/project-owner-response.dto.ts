export class ProjectOwnerResponseDto {
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
  beneficiaryName: string;
  address: string;
  mobilePhone: string;
  telephone?: string;
  projectOwnerName: string;
  projectOwnerAge: number;
  projectOwnerGender: string;

  empowermentDimension?: {
    empowerment_dimension_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
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

  beneficiaryType?: {
    beneficiary_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };
}
