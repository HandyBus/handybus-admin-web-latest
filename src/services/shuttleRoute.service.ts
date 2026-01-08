import {
  CreateShuttleRouteRequest,
  CreateShuttleRouteRequestSchema,
  ShuttleRouteStatus,
  AdminShuttleRoutesViewEntitySchema,
  TripType,
  ShuttleRouteAlertRequestsViewEntitySchema,
} from '@/types/shuttleRoute.type';
import { authInstance } from './config';
import { toSearchParamString } from '@/utils/searchParam.util';
import { withPagination } from '@/types/common.type';
import { useMutation, useQuery } from '@tanstack/react-query';
import { silentParse } from '@/utils/parse.util';

// ----- GET -----

export interface GetShuttleRoutesOptions {
  status?: ShuttleRouteStatus;
  provinceFullName?: string;
  provinceShortName?: string;
  cityFullName?: string;
  cityShortName?: string;
}

// TODO 추후에 pagination으로 변경
export const useGetShuttleRoutes = (options?: GetShuttleRoutesOptions) => {
  return useQuery({
    queryKey: ['shuttleRoute', options],
    queryFn: () => getShuttleRoutes(options),
  });
};

export const getShuttleRoutesOfDailyEvent = async (
  eventId: string,
  dailyEventId: string,
  options?: GetShuttleRoutesOptions,
) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes${toSearchParamString({ ...options }, '?')}`,
    {
      shape: withPagination({
        shuttleRoutes: AdminShuttleRoutesViewEntitySchema.array(),
      }),
    },
  );
  return res.shuttleRoutes;
};

// TODO 추후에 pagination으로 변경
export const useGetShuttleRoutesOfDailyEvent = (
  eventId: string,
  dailyEventId: string,
  options?: GetShuttleRoutesOptions,
) => {
  return useQuery({
    queryKey: ['shuttleRoute', eventId, dailyEventId, options],
    queryFn: () => getShuttleRoutesOfDailyEvent(eventId, dailyEventId, options),
    enabled: !!eventId && !!dailyEventId,
    initialData: [],
  });
};

export const getShuttleRoutes = async (options?: GetShuttleRoutesOptions) => {
  const response = await authInstance.get(
    `/v2/shuttle-operation/admin/events/all/dates/all/routes${toSearchParamString({ ...options }, '?')}`,
    {
      shape: withPagination({
        shuttleRoutes: AdminShuttleRoutesViewEntitySchema.array(),
      }),
    },
  );
  return response.shuttleRoutes;
};

export const getShuttleRoute = async (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}`,
    {
      shape: {
        shuttleRoute: AdminShuttleRoutesViewEntitySchema,
      },
    },
  );
  return res.shuttleRoute;
};

export const useGetShuttleRoute = (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
) => {
  return useQuery({
    queryKey: ['shuttleRoute', eventId, dailyEventId, shuttleRouteId],
    queryFn: () => getShuttleRoute(eventId, dailyEventId, shuttleRouteId),
  });
};

export const getAlertRequests = async (shuttleRouteIds: string[]) => {
  if (!Array.isArray(shuttleRouteIds) || shuttleRouteIds.length === 0) {
    return [];
  }

  const idsParam = encodeURIComponent(shuttleRouteIds.join(','));
  const res = await authInstance.get(
    `/v1/shuttle-operation/admin/alert-requests?shuttleRouteIds=${idsParam}`,
    {
      shape: {
        shuttleRouteAlertRequests:
          ShuttleRouteAlertRequestsViewEntitySchema.array(),
      },
    },
  );
  return res.shuttleRouteAlertRequests;
};

export const useGetAlertRequests = (shuttleRouteIds: string[]) => {
  return useQuery({
    queryKey: ['alertRequests', shuttleRouteIds],
    queryFn: () => getAlertRequests(shuttleRouteIds),
    enabled: Array.isArray(shuttleRouteIds) && shuttleRouteIds.length > 0,
    initialData: [],
  });
};

// ----- POST -----

export const postShuttleRoute = async (
  eventId: string,
  dailyEventId: string,
  body: CreateShuttleRouteRequest,
) => {
  await authInstance.post(
    `/v3/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes`,
    silentParse(CreateShuttleRouteRequestSchema, body),
  );
};

export const usePostShuttleRoute = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  return useMutation({
    mutationFn: ({
      eventId,
      dailyEventId,
      body,
    }: {
      eventId: string;
      dailyEventId: string;
      body: CreateShuttleRouteRequest;
    }) => postShuttleRoute(eventId, dailyEventId, body),
    onSuccess,
    onError,
  });
};

interface PutShuttleRouteBody {
  name?: string;
  reservationDeadline?: string;
  maxPassengerCount?: number;
  status?: ShuttleRouteStatus;
  isReservationDisabled?: {
    toDestination?: boolean;
    fromDestination?: boolean;
    roundTrip?: boolean;
  };
  shuttleRouteHubs?: {
    shuttleRouteHubId?: string;
    regionHubId?: string;
    type?: Exclude<TripType, 'ROUND_TRIP'>;
    sequence?: number;
    arrivalTime?: string;
  }[];
  regularPrice?: {
    roundTrip?: number;
    toDestination?: number;
    fromDestination?: number;
  };
  earlybirdPrice?: {
    roundTrip?: number;
    toDestination?: number;
    fromDestination?: number;
  };
}

// ID가 주어지지 않은 셔틀 허브는 새로 생성합니다. ID가 주어진 기존 값은 수정합니다. ID가 주어지지 않은 기존 값은 아무 변화없이 유지합니다.
export const putShuttleRoute = async (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
  body: PutShuttleRouteBody,
) => {
  await authInstance.put(
    `/v3/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}`,
    body,
  );
};

export const usePutShuttleRoute = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  return useMutation({
    mutationFn: ({
      eventId,
      dailyEventId,
      shuttleRouteId,
      body,
    }: {
      eventId: string;
      dailyEventId: string;
      shuttleRouteId: string;
      body: PutShuttleRouteBody;
    }) => putShuttleRoute(eventId, dailyEventId, shuttleRouteId, body),
    onSuccess,
    onError,
  });
};

export const deleteShuttleRoute = async (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
) => {
  await authInstance.delete(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}`,
  );
};

export const useDeleteShuttleRoute = () => {
  return useMutation({
    mutationFn: ({
      eventId,
      dailyEventId,
      shuttleRouteId,
    }: {
      eventId: string;
      dailyEventId: string;
      shuttleRouteId: string;
    }) => deleteShuttleRoute(eventId, dailyEventId, shuttleRouteId),
  });
};

export const deleteShuttleRoutes = async (
  eventId: string,
  dailyEventId: string,
  body: {
    shuttleRouteIds: string[];
  },
) => {
  await authInstance.delete(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes`,
    body,
  );
};

export const useDeleteShuttleRoutes = () => {
  return useMutation({
    mutationFn: ({
      eventId,
      dailyEventId,
      body,
    }: {
      eventId: string;
      dailyEventId: string;
      body: { shuttleRouteIds: string[] };
    }) => deleteShuttleRoutes(eventId, dailyEventId, body),
  });
};
