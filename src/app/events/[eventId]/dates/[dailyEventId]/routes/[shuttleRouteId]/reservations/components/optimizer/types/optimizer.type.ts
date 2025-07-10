import { ReservationViewEntity } from '@/types/reservation.type';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';
import { TripType } from '@/types/shuttleRoute.type';

export type TripTypeWithRoundTrip = Exclude<TripType, 'ROUND_TRIP'>;

export type CalculatedData = {
  order: number;
  reservation: ReservationViewEntity;
  // bus?: ShuttleBusesViewEntity;
};

export type BusAndReservation = {
  bus: ShuttleBusesViewEntity;
  reservation: ReservationViewEntity;
};

export type BusWithSeat = {
  bus: ShuttleBusesViewEntity;
  maxSeat: number;
  toDestinationFilledSeat: number;
  fromDestinationFilledSeat: number;
};

// 지도 표시용 클러스터링된 데이터 타입
export interface ClusteredRouteResult {
  orders: number[];
  longitude: number;
  latitude: number;
  addresses: string[];
  tripType: TripType;
  isCluster: boolean;
  displayText: string;
}
