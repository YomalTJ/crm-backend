export class GrantUtilizationResponseDto {
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

  financialAid: {
    totalProjects: number;
    totalAmount: number;
  };

  interestSubsidizedLoan: {
    totalProjects: number;
    totalAmount: number;
  };

  samurdiBankLoan: {
    totalProjects: number;
    totalAmount: number;
  };

  overallTotal: {
    totalProjects: number;
    totalAmount: number;
  };
}
