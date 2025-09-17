export class BeneficiaryFilterDto {
  district_id?: string;
  ds_id?: string;
  zone_id?: string;
  gnd_id?: string;
  mainProgram?: 'NP' | 'WB' | 'ADB';
  beneficiary_type_id?: string;
}

export class DemographicFilterDto {
  district_id?: string;
  ds_id?: string;
  zone_id?: string;
  gnd_id?: string;
  mainProgram?: 'NP' | 'WB' | 'ADB';
  beneficiary_type_id?: string;

  // Age range filters for family members
  minAge?: number;
  maxAge?: number;
  specificAgeRange?: 'below16' | '16To24' | '25To45' | '46To60' | 'above60';
}
