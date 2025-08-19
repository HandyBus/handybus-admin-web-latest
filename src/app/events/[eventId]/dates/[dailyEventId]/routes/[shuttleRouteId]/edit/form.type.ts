import { ShuttleRouteStatus } from '@/types/shuttleRoute.type';

export interface FormValues {
  name: string;
  reservationDeadline: string;
  hasEarlybird: boolean;
  earlybirdDeadline?: string;
  maxPassengerCount: number;
  status: ShuttleRouteStatus;
  shuttleRouteHubsFromDestination: {
    shuttleRouteHubId?: string;
    regionHubId: string;
    regionId?: string;
    arrivalTime: string;
  }[];
  shuttleRouteHubsToDestination: {
    shuttleRouteHubId?: string;
    regionHubId: string;
    regionId?: string;
    arrivalTime: string;
  }[];
  regularPrice: {
    roundTrip: number;
    toDestination: number;
    fromDestination: number;
  };
  earlybirdPrice?: {
    roundTrip: number;
    toDestination: number;
    fromDestination: number;
  };
}
