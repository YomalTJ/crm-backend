export class BeneficiaryResponseDto {
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
  projectOwnerAge: number;
  projectOwnerGender: string;

  disability?: {
    disability_id: number;
    nameEN: string;
    nameSi: string;
    nameTa: string;
  };

  beneficiaryType: {
    beneficiary_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };
}
