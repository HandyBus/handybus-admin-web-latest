import { TripType } from '@/types/shuttleRoute.type';

export type TripTypeWithoutRoundTrip = Exclude<TripType, 'ROUND_TRIP'>;

export interface HandyPartyReservation {
  reservationId: string;
  shuttleRouteId: string;
  shuttleName: string;
  nickname: string;
  phoneNumber: string;
  tripType: TripTypeWithoutRoundTrip;
  address: string;
  latitude: number;
  longitude: number;
}

export interface HandyPartyRoute {
  shuttleRouteId: string;
  shuttleName: string;
  isChecked: boolean;
}

export interface CalculatedOptimalRouteData {
  index: number;
  order: number | null;
  reservationId: string | null;
  shuttleRouteId: string | null;
  shuttleName: string | null;
  nickname: string | null;
  phoneNumber: string | null;
  tripType: TripTypeWithoutRoundTrip | null;
  address: string | null;
  longitude: number | null;
  latitude: number | null;
  isSpacer: boolean;
}

export interface HandyPartyReservationExcelData extends HandyPartyReservation {
  partyId: number;
  order: number;
}
