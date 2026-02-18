export interface TimezoneRecord {
  countryCode: string;
  countryName: string;
  zoneName: string;
  gmtOffset: number;
  dst?: number | boolean;
}

export interface TimezoneApiResponse {
  status: 'OK' | 'FAILED';
  message: string;
  zones: TimezoneRecord[];
}
