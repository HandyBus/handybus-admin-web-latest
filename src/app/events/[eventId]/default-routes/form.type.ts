import { RegionHubsViewEntity } from '@/types/hub.type';

export type SeasonType = '성수기' | '비수기';

export interface BulkRouteFormValues {
  selectedDailyEventIds: string[];
  destinationHub: RegionHubsViewEntity | undefined;
  reservationDeadlineDays: number; // 상대일수 (default: 4)
  toDestinationArrivalTime: string | null; // 도착지 도착 시간 (HH:mm 형식)
  fromDestinationDepartureTime: string | null; // 도착지 출발 시간 (HH:mm 형식)
  season: SeasonType;
  routes: BulkRouteItem[];
}

export interface BulkRouteItem {
  name: string;
  maxPassengerCount: number;
  isEnabled: boolean; // 노선 생성 여부
  hasEarlybird: boolean;
  earlybirdPrice: {
    toDestination: number;
    fromDestination: number;
    roundTrip: number;
  };
  regularPrice: {
    toDestination: number;
    fromDestination: number;
    roundTrip: number;
  };
  toDestinationHubs: ({
    regionId: string | null;
    regionHubId: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null)[];
  toDestinationArrivalTimes: {
    time: string;
  }[];
  fromDestinationArrivalTimes: {
    time: string;
  }[];
}
