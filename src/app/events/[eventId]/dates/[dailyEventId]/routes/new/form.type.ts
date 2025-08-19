import { RegionHubsViewEntity } from '@/types/hub.type';

export interface MultiRouteFormValues {
  destinationHub: RegionHubsViewEntity;
  shuttleRoutes: SingleRouteFormValues[];
}

export interface SingleRouteFormValues {
  name: string;
  reservationDeadline: string;
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
  earlybirdDeadline: string;
  maxPassengerCount: number;
  toDestinationHubs: ({
    // NOTE: 가는편와 오는편 경유지는 미러링 보장
    regionId: string | null;
    regionHubId: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null)[];
  toDestinationArrivalTimes: {
    time: string; // NOTE: useFieldsArray의 버그로 인해 객체로 선언
  }[];
  fromDestinationArrivalTimes: {
    time: string;
  }[];
}
