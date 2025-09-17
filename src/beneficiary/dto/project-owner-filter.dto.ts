export class ProjectOwnerFilterDto {
  district_id?: string;
  ds_id?: string;
  zone_id?: string;
  gnd_id?: string;
  mainProgram?: 'NP' | 'WB' | 'ADB';
  beneficiary_type_id?: string;
}
