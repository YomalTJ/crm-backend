export class HouseholdCitizenResponseDto {
  household: {
    hhReference: string;
    gnCode: string;
    applicantName: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    singleMother: 'Yes' | 'No';
    level: number;
  };
  citizens: {
    name: string;
    dateOfBirth: Date;
    age: number;
    gender: 'male' | 'female' | 'other';
  }[];
}
