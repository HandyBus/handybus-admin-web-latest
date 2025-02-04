import { ArtistsViewEntitySchema } from '@/types/artist.type';
import { authInstance, withPagination } from './config';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toSearchParamString } from '@/utils/searchParam.util';
import {
  CreateEventRequest,
  CreateEventRequestSchema,
  EventStatus,
  EventsViewEntitySchema,
  UpdateEventRequest,
  UpdateEventRequestSchema,
} from '@/types/event.type';
import {
  CreateShuttleRouteRequest,
  CreateShuttleRouteRequestSchema,
  ShuttleRouteStatus,
  ShuttleRoutesViewEntitySchema,
  TripType,
} from '@/types/shuttleRoute.type';
import {
  AdminUpdateShuttleBusRequest,
  AdminUpdateShuttleBusRequestSchema,
  BulkAssignBusRequest,
  BulkAssignBusRequestSchema,
  CreateShuttleBusRequest,
  CreateShuttleBusRequestSchema,
  ShuttleBusesViewEntitySchema,
} from '@/types/shuttleBus.type';
import {
  CancelStatus,
  HandyStatus,
  ReservationStatus,
  ReservationViewEntitySchema,
} from '@/types/reservation.type';
import {
  PaymentsViewEntitySchema,
  TossPaymentsEntitySchema,
} from '@/types/payment.type';
import { silentParse } from '@/utils/parse.util';
import { ShuttleDemandStatisticsReadModelSchema } from '@/types/demand.type';

// ----- 조회 -----

export const getArtists = async () => {
  const res = await authInstance.get('/v2/shuttle-operation/admin/artists', {
    shape: {
      artists: ArtistsViewEntitySchema.array(),
    },
  });
  return res.artists;
};

export const useGetArtists = () => {
  return useQuery({
    queryKey: ['artist'],
    queryFn: getArtists,
  });
};

export const getArtist = async (artistId: number) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/artists/${artistId}`,
    {
      shape: {
        artist: ArtistsViewEntitySchema,
      },
    },
  );
  return res.artist;
};

export const useGetArtist = (artistId: number) => {
  return useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => getArtist(artistId),
  });
};

export interface GetDemandOptions {
  groupBy:
    | 'EVENT'
    | 'DAILY_EVENT'
    | 'PROVINCE'
    | 'CITY'
    | 'TO_DESTINATION_REGION_HUB'
    | 'FROM_DESTINATION_REGION_HUB';
  provinceFullName?: string;
  provinceShortName?: string;
  cityFullName?: string;
  cityShortName?: string;
  dailyEventId?: number;
  eventId?: number;
}

export const getDemandsStats = async (options?: GetDemandOptions) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/demands/all/stats${toSearchParamString({ ...options }, '?')}`,
    {
      shape: {
        statistics: ShuttleDemandStatisticsReadModelSchema.array(),
      },
    },
  );
  return res.statistics;
};

export const useGetDemandsStats = (options?: GetDemandOptions) => {
  return useQuery({
    queryKey: ['demand', 'stats', options],
    queryFn: () => getDemandsStats(options),
  });
};

export const getEvents = async (options?: { status?: EventStatus }) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events${toSearchParamString({ ...options }, '?')}`,
    {
      shape: withPagination({
        events: EventsViewEntitySchema.array(),
      }),
    },
  );
  return res.events;
};

// TODO 추후에 pagination으로 변경
export const useGetEvents = (options?: { status?: EventStatus }) => {
  return useQuery({
    queryKey: ['event', options],
    queryFn: () => getEvents(options),
  });
};

export const getEvent = async (eventId: number) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}`,
    {
      shape: {
        event: EventsViewEntitySchema,
      },
    },
  );
  return res.event;
};

export const useGetEvent = (eventId: number) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId),
  });
};

export interface GetShuttleRoutesOptions {
  status?: ShuttleRouteStatus;
  provinceFullName?: string;
  provinceShortName?: string;
  cityFullName?: string;
  cityShortName?: string;
}

export const getShuttleRoutesOfDailyEvent = async (
  eventId: number,
  dailyEventId: number,
  options?: GetShuttleRoutesOptions,
) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes${toSearchParamString({ ...options }, '?')}`,
    {
      shape: withPagination({
        shuttleRoutes: ShuttleRoutesViewEntitySchema.array(),
      }),
    },
  );
  return res.shuttleRoutes;
};

// TODO 추후에 pagination으로 변경
export const useGetShuttleRoutesOfDailyEvent = (
  eventId: number,
  dailyEventId: number,
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
        shuttleRoutes: ShuttleRoutesViewEntitySchema.array(),
      }),
    },
  );
  return response.shuttleRoutes;
};

// TODO 추후에 pagination으로 변경
export const useGetShuttleRoutes = (options?: GetShuttleRoutesOptions) => {
  return useQuery({
    queryKey: ['shuttleRoute', options],
    queryFn: () => getShuttleRoutes(options),
  });
};

export const getShuttleRoute = async (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}`,
    {
      shape: {
        shuttleRoute: ShuttleRoutesViewEntitySchema,
      },
    },
  );
  return res.shuttleRoute;
};

export const useGetShuttleRoute = (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
) => {
  return useQuery({
    queryKey: ['shuttleRoute', eventId, dailyEventId, shuttleRouteId],
    queryFn: () => getShuttleRoute(eventId, dailyEventId, shuttleRouteId),
  });
};

export const getShuttleBuses = async (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses`,
    {
      shape: {
        shuttleBuses: ShuttleBusesViewEntitySchema.array(),
      },
    },
  );
  return res.shuttleBuses;
};

export const useGetShuttleBuses = (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
) => {
  return useQuery({
    queryKey: ['shuttleBus', eventId, dailyEventId, shuttleRouteId],
    queryFn: () => getShuttleBuses(eventId, dailyEventId, shuttleRouteId),
  });
};

export const getShuttleBus = async (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses`,
    {
      shape: {
        shuttleBus: ShuttleBusesViewEntitySchema,
      },
    },
  );
  return res.shuttleBus;
};

export const useGetShuttleBus = (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
) => {
  return useQuery({
    queryKey: ['shuttleBus', eventId, dailyEventId, shuttleRouteId],
    queryFn: () => getShuttleBuses(eventId, dailyEventId, shuttleRouteId),
  });
};

export interface GetReservationsOptions {
  eventId: number | undefined;
  dailyEventId: number | undefined;
  shuttleRouteId: number | undefined;
  shuttleBusId: number | undefined;
  userNickname: string | undefined;
  passengerName: string | undefined;
  handyStatus: HandyStatus | undefined;
  reservationStatus: ReservationStatus | undefined;
  cancelStatus: CancelStatus | undefined;
}

interface GetReservationsOptionsWithPagination extends GetReservationsOptions {
  page: string | undefined;
  limit: number;
}

export const getReservations = async (
  option?: Partial<GetReservationsOptionsWithPagination>,
) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/reservations${toSearchParamString({ ...option }, '?')}`,
    {
      shape: withPagination({
        reservations: ReservationViewEntitySchema.array(),
      }),
    },
  );
  return res;
};

export const useGetReservationsWithPagination = (
  option?: Partial<GetReservationsOptionsWithPagination>,
) =>
  useInfiniteQuery({
    queryKey: ['reservation', option],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getReservations({ ...option, page: pageParam }),
    initialPageParam: undefined,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    placeholderData: keepPreviousData,
  });

export const getReservation = async (reservationId: number) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/reservations/${reservationId}`,
    {
      shape: {
        reservation: ReservationViewEntitySchema,
        payment: PaymentsViewEntitySchema,
        tossPayments: TossPaymentsEntitySchema,
      },
    },
  );
  return res;
};

export const useGetReservation = (reservationId: number) => {
  return useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: () => getReservation(reservationId),
  });
};

// ----- 명령 -----

export const postArtist = async (body: { name: string }) => {
  await authInstance.post('/v1/shuttle-operation/admin/artists', body);
};

export const usePostArtist = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  return useMutation({
    mutationFn: postArtist,
    onSuccess,
    onError,
  });
};

export const putArtist = async (artistId: number, body: { name: string }) => {
  await authInstance.put(
    `/v1/shuttle-operation/admin/artists/${artistId}`,
    body,
  );
};

export const usePutArtist = () => {
  return useMutation({
    mutationFn: ({ artistId, name }: { artistId: number; name: string }) =>
      putArtist(artistId, { name }),
  });
};

export const deleteArtist = async (artistId: number) => {
  await authInstance.delete(`/v1/shuttle-operation/admin/artists/${artistId}`);
};

export const useDeleteArtist = () => {
  return useMutation({
    mutationFn: deleteArtist,
  });
};

export const deleteArtists = async (artistIds: number[]) => {
  await authInstance.delete(`/v1/shuttle-operation/admin/artists`, {
    artistIds,
  });
};

export const useDeleteArtists = () => {
  return useMutation({
    mutationFn: deleteArtists,
  });
};

export interface PutReservationBody {
  toDestinationShuttleRouteHubId?: number;
  fromDestinationShuttleRouteHubId?: number;
  handyStatus?: HandyStatus;
  shuttleBusId?: number;
}

export const putReservation = async (
  reservationId: number,
  body: PutReservationBody,
) => {
  await authInstance.put(
    `/v1/shuttle-operation/admin/reservations/${reservationId}`,
    body,
  );
};

export const usePutReservation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reservationId,
      body,
    }: {
      reservationId: number;
      body: PutReservationBody;
    }) => putReservation(reservationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation'] });
      onSuccess?.();
    },
    onError,
  });
};

export const postEvent = async (body: CreateEventRequest) => {
  await authInstance.post(
    '/v2/shuttle-operation/admin/events',
    silentParse(CreateEventRequestSchema, body),
  );
};

export const usePostEvent = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event'] });
      onSuccess?.();
    },
    onError,
  });
};

export const putEvent = async (eventId: number, body: UpdateEventRequest) => {
  await authInstance.put(
    `/v2/shuttle-operation/admin/events/${eventId}`,
    silentParse(UpdateEventRequestSchema, body),
  );
};

export const usePutEvent = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  return useMutation({
    mutationFn: ({
      eventId,
      body,
    }: {
      eventId: number;
      body: UpdateEventRequest;
    }) => putEvent(eventId, body),
    onSuccess,
    onError,
  });
};

export const postShuttleRoute = async (
  eventId: number,
  dailyEventId: number,
  body: CreateShuttleRouteRequest,
) => {
  await authInstance.post(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes`,
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
      eventId: number;
      dailyEventId: number;
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
  shuttleRouteHubs?: {
    shuttleRouteHubId?: number;
    regionHubId?: number;
    type?: Omit<TripType, 'ROUND_TRIP'>;
    sequence?: number;
    arrivalTime?: string;
  }[];
}

// ID가 주어지지 않은 셔틀 허브는 새로 생성합니다. ID가 주어진 기존 값은 수정합니다. ID가 주어지지 않은 기존 값은 아무 변화없이 유지합니다.
export const putShuttleRoute = async (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
  body: PutShuttleRouteBody,
) => {
  await authInstance.put(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}`,
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
      eventId: number;
      dailyEventId: number;
      shuttleRouteId: number;
      body: PutShuttleRouteBody;
    }) => putShuttleRoute(eventId, dailyEventId, shuttleRouteId, body),
    onSuccess,
    onError,
  });
};

export const deleteShuttleRoute = async (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
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
      eventId: number;
      dailyEventId: number;
      shuttleRouteId: number;
    }) => deleteShuttleRoute(eventId, dailyEventId, shuttleRouteId),
  });
};

export const deleteShuttleRoutes = async (
  eventId: number,
  dailyEventId: number,
  body: {
    shuttleRouteIds: number[];
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
      eventId: number;
      dailyEventId: number;
      body: { shuttleRouteIds: number[] };
    }) => deleteShuttleRoutes(eventId, dailyEventId, body),
  });
};

export const postShuttleBus = async (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
  body: CreateShuttleBusRequest,
) => {
  await authInstance.post(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses`,
    silentParse(CreateShuttleBusRequestSchema, body),
  );
};

export const usePostShuttleBus = ({
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
      eventId: number;
      dailyEventId: number;
      shuttleRouteId: number;
      body: CreateShuttleBusRequest;
    }) => postShuttleBus(eventId, dailyEventId, shuttleRouteId, body),
    onSuccess,
    onError,
  });
};

export const putShuttleBus = async (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
  shuttleBusId: number,
  body: AdminUpdateShuttleBusRequest,
) => {
  await authInstance.put(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses/${shuttleBusId}`,
    silentParse(AdminUpdateShuttleBusRequestSchema, body),
  );
};

export const usePutShuttleBus = () => {
  return useMutation({
    mutationFn: ({
      eventId,
      dailyEventId,
      shuttleRouteId,
      shuttleBusId,
      body,
    }: {
      eventId: number;
      dailyEventId: number;
      shuttleRouteId: number;
      shuttleBusId: number;
      body: AdminUpdateShuttleBusRequest;
    }) =>
      putShuttleBus(eventId, dailyEventId, shuttleRouteId, shuttleBusId, body),
  });
};

export const postBulkAssignBus = async (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
  body: BulkAssignBusRequest,
) => {
  return await authInstance.post(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses/bulk-assign`,
    silentParse(BulkAssignBusRequestSchema, body),
  );
};

export const usePostBulkAssignBus = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      dailyEventId,
      shuttleRouteId,
      body,
    }: {
      eventId: number;
      dailyEventId: number;
      shuttleRouteId: number;
      body: BulkAssignBusRequest;
    }) => postBulkAssignBus(eventId, dailyEventId, shuttleRouteId, body),
    onSuccess: (_, { eventId, dailyEventId, shuttleRouteId }) => {
      queryClient.invalidateQueries({
        queryKey: ['reservation', eventId, dailyEventId, shuttleRouteId],
      });
      onSuccess?.();
    },
    onError,
  });
};
