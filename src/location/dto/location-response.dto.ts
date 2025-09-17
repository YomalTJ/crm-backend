export class LocationResponseDto {
  districts?: {
    id: string;
    name: string;
  }[];

  dss?: {
    id: string;
    name: string;
    districtId: string;
  }[];

  zones?: {
    id: string;
    name: string;
    dsId: string;
  }[];

  gnds?: {
    id: string;
    name: string;
    zoneId: string;
  }[];
}
