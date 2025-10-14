import { TripType } from '@/types/shuttleRoute.type';

export type TripTypeWithoutRoundTrip = Exclude<TripType, 'ROUND_TRIP'>;

export interface HandyPartyReservation {
  reservationId: string;
  shuttleRouteId: string;
  shuttleName: string;
  name: string;
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
  name: string | null;
  nickname: string | null;
  phoneNumber: string | null;
  tripType: TripTypeWithoutRoundTrip | null;
  address: string | null;
  longitude: number | null;
  latitude: number | null;
  isSpacer: boolean;
}

// 지도 표시용 클러스터링된 데이터 타입
export interface ClusteredRouteResult {
  orders: number[];
  longitude: number;
  latitude: number;
  addresses: string[];
  tripType: TripTypeWithoutRoundTrip;
  isCluster: boolean;
  displayText: string;
}

export interface HandyPartyReservationExcelData extends HandyPartyReservation {
  partyId: number;
  order: number;
}
