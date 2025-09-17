export class BeneficiaryTypeCountDto {
  beneficiary_type_id: string;
  nameEnglish: string;
  nameSinhala: string;
  nameTamil: string;
  count: number;
}

export class BeneficiaryTypeCountResponseDto {
  counts: BeneficiaryTypeCountDto[];
  location?: {
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
}
