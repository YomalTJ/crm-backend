// AreaTypeResponseDto
export class AreaTypeResponseDto {
  district?: {
    district_id: number;
    district_name: string;
  };
  ds?: {
    ds_id: number;
    ds_name: string;
  };
  zone?: {
    zone_id: number;
    zone_name: string;
  };
  gnd?: {
    gnd_id: string;
    gnd_name: string;
  };
  programs: ProgramAreaTypeDto[];
}

// ProgramAreaTypeDto
export class ProgramAreaTypeDto {
  mainProgram: string;
  areaTypeCounts: {
    URBAN: number;
    RURAL: number;
    ESTATE: number;
    total: number;
  };
}
