export class EmpowermentRefusalResponseDto {
  beneficiaryName: string;
  nic: string;
  mobilePhone: string;
  address: string;
  mainProgram: string;
  refusalReason: {
    id: number;
    reason_si: string;
    reason_en: string;
    reason_ta: string;
  };
  location: {
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
  createdAt: Date;
}
