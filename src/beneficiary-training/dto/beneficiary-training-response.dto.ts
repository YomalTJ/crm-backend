export class BeneficiaryTrainingResponseDto {
  id: number;
  districtId: string;
  dsId: string;
  zoneId: string;
  gndId: string;
  hhNumber: string;
  nicNumber: string;
  name: string;
  address: string;
  phoneNumber: string;
  trainingActivitiesDone: boolean;
  trainingActivitiesRequired: boolean;
  courseId: number;
  trainingInstitution: string;
  trainingInstituteAddress: string;
  trainingInstitutePhone: string;
  courseCost: number;
  trainingDuration: string;
  trainerName: string;
  trainerContactNumber: string;

  // Location details with names (nullable)
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

  course?: {
    id: number;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };

  constructor(beneficiaryTraining: any) {
    this.id = beneficiaryTraining.id;
    this.districtId = beneficiaryTraining.districtId;
    this.dsId = beneficiaryTraining.dsId;
    this.zoneId = beneficiaryTraining.zoneId;
    this.gndId = beneficiaryTraining.gndId;
    this.hhNumber = beneficiaryTraining.hhNumber;
    this.nicNumber = beneficiaryTraining.nicNumber;
    this.name = beneficiaryTraining.name;
    this.address = beneficiaryTraining.address;
    this.phoneNumber = beneficiaryTraining.phoneNumber;
    this.trainingActivitiesDone = beneficiaryTraining.trainingActivitiesDone;
    this.trainingActivitiesRequired =
      beneficiaryTraining.trainingActivitiesRequired;
    this.courseId = beneficiaryTraining.courseId;
    this.trainingInstitution = beneficiaryTraining.trainingInstitution;
    this.trainingInstituteAddress =
      beneficiaryTraining.trainingInstituteAddress;
    this.trainingInstitutePhone = beneficiaryTraining.trainingInstitutePhone;
    this.courseCost = beneficiaryTraining.courseCost;
    this.trainingDuration = beneficiaryTraining.trainingDuration;
    this.trainerName = beneficiaryTraining.trainerName;
    this.trainerContactNumber = beneficiaryTraining.trainerContactNumber;

    // Map location details (only if they exist)
    if (beneficiaryTraining.district) {
      this.district = {
        district_id: beneficiaryTraining.district.district_id,
        district_name: beneficiaryTraining.district.district_name,
      };
    }

    if (beneficiaryTraining.ds) {
      this.ds = {
        ds_id: beneficiaryTraining.ds.ds_id,
        ds_name: beneficiaryTraining.ds.ds_name,
      };
    }

    if (beneficiaryTraining.zone) {
      this.zone = {
        zone_id: beneficiaryTraining.zone.zone_id,
        zone_name: beneficiaryTraining.zone.zone_name,
      };
    }

    if (beneficiaryTraining.gnd) {
      this.gnd = {
        gnd_id: beneficiaryTraining.gnd.gnd_id,
        gnd_name: beneficiaryTraining.gnd.gnd_name,
      };
    }

    if (beneficiaryTraining.course) {
      this.course = {
        id: beneficiaryTraining.course.id,
        nameEnglish: beneficiaryTraining.course.nameEnglish,
        nameSinhala: beneficiaryTraining.course.nameSinhala,
        nameTamil: beneficiaryTraining.course.nameTamil,
      };
    }
  }
}
