import { TripType } from '@/types/shuttleRoute.type';

export type SingleSideTripType = Exclude<TripType, 'ROUND_TRIP'>;

export interface AddressData {
  longitude: number;
  latitude: number;
  address: string;
  tripType: SingleSideTripType;
}

export interface CalculatedData {
  order: number;
  longitude: number;
  latitude: number;
  address: string;
  tripType: SingleSideTripType;
}

// 지도 표시용 클러스터링된 데이터 타입
export interface ClusteredRouteResult {
  orders: number[];
  longitude: number;
  latitude: number;
  addresses: string[];
  tripType: SingleSideTripType;
  isCluster: boolean;
  displayText: string;
}
