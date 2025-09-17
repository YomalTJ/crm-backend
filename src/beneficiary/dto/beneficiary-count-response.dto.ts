export class ProgramCountDto {
  mainProgram: string;
  count: number;
}

export class YearlyProgramCountDto {
  year: number;
  programs: ProgramCountDto[];
}

export class BeneficiaryCountResponseDto {
  data: YearlyProgramCountDto[];
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
