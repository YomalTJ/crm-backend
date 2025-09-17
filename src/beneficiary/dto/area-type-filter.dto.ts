export class AreaTypeFilterDto {
  district_id?: string;
  ds_id?: string;
  zone_id?: string;
  gnd_id?: string;
  mainProgram?: 'NP' | 'WB' | 'ADB';
  areaClassification?: 'URBAN' | 'RURAL' | 'ESTATE';
}
