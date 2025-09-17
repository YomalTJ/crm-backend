import { BusinessEmpowerment } from "../entities/business-empowerment.entity";

export class BusinessEmpowermentResponseDto extends BusinessEmpowerment {
  district_name?: string;
  ds_name?: string;
  zone_name?: string;
  gnd_name?: string;
  livelihood_name?: string;
  livelihood_sinhala_name?: string;
  livelihood_tamil_name?: string;
  project_type_name_english?: string;
  project_type_name_sinhala?: string;
  project_type_name_tamil?: string;
  job_field_name_english?: string;
  job_field_name_sinhala?: string;
  job_field_name_tamil?: string;
}

export interface BusinessEmpowermentResponse {
  id: string;
  nic: string;
  name: string;
  phone: string;
  address: string;
  district_id: string;
  ds_id: string;
  zone_id: string;
  gnd_id: string;
  livelihood_id?: string;
  project_type_id?: string;
  job_field_id?: string;
  governmentContribution?: number;
  beneficiaryContribution?: number;
  bankLoan?: number;
  linearOrganizationContribution?: number;
  total?: number;
  capitalAssets?: string;
  expectedMonthlyProfit?: number;
  advisingMinistry?: string;
  officerName?: string;
  officerPosition?: string;
  officerMobileNumber?: string;
  developmentOfficer?: string;
  projectManager?: string;
  technicalOfficer?: string;
  divisionalSecretary?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Additional fields for enriched response
  district_name?: string;
  ds_name?: string;
  zone_name?: string;
  gnd_name?: string;
  livelihood_name?: string;
  livelihood_sinhala_name?: string;
  livelihood_tamil_name?: string;
  project_type_name_english?: string;
  project_type_name_sinhala?: string;
  project_type_name_tamil?: string;
  job_field_name_english?: string;
  job_field_name_sinhala?: string;
  job_field_name_tamil?: string;
}