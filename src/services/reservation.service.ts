import {
  CancelStatus,
  HandyStatus,
  ReservationStatus,
  ReservationViewEntitySchema,
} from '@/types/reservation.type';
import { authInstance } from './config';
import { toSearchParamString } from '@/utils/searchParam.util';
import { withPagination } from '@/types/common.type';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  PaymentsViewEntitySchema,
  TossPaymentsEntitySchema,
} from '@/types/payment.type';
import dayjs from 'dayjs';
import {
  DashboardOptions,
  TotalCancellationCountsReadModelSchema,
  TotalReservationCountsReadModelSchema,
  TotalReservationPassengerCountsReadModelSchema,
} from '@/types/dashboard.type';
import { ShuttleRouteStatus } from '@/types/shuttleRoute.type';

// ----- GET -----

export interface GetReservationsOptions {
  eventId: string | undefined;
  dailyEventId: string | undefined;
  shuttleRouteId: string | undefined;
  shuttleBusId: string | undefined;
  userName: string | undefined;
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

export const getReservation = async (reservationId: string) => {
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

export const useGetReservation = (reservationId: string) => {
  return useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: () => getReservation(reservationId),
  });
};

export const getUserReservations = async (
  userId: string,
  params?: {
    reservationStatus?: ReservationStatus;
    shuttleRouteStatus?: ShuttleRouteStatus;
  },
) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}/reservations${toSearchParamString(params, '?')}`,
    {
      shape: {
        reservations: ReservationViewEntitySchema.array(),
      },
    },
  );
  return res.reservations;
};

export const useGetUserReservations = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId, 'reservation'],
    queryFn: () => getUserReservations(userId),
  });
};

export const getUserReservation = async (
  userId: string,
  reservationId: string,
) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}/reservations/${reservationId}`,
    {
      shape: {
        reservation: ReservationViewEntitySchema.nullable(),
        payment: PaymentsViewEntitySchema.nullable(),
        tossPayments: TossPaymentsEntitySchema.nullable(),
      },
    },
  );
  return res;
};

export const useGetUserReservation = (
  userId: string,
  reservationId: string,
) => {
  return useQuery({
    queryKey: ['user', userId, 'reservation', reservationId],
    queryFn: () => getUserReservation(userId, reservationId),
  });
};

interface GetTotalReservationPassengerCountsOptions extends DashboardOptions {
  shuttleRouteId: string; // 복수 가능
  reservationStatus: ReservationStatus;
}

export const getTotalReservationPassengerCounts = async ({
  baseDate = dayjs().tz().endOf('day').toISOString(),
  totalRangeDate = 6,
  intervalDays = 1,
  ...options
}: Partial<GetTotalReservationPassengerCountsOptions> = {}) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/reservations/all/total-passengers${toSearchParamString(
      {
        baseDate,
        totalRangeDate,
        intervalDays,
        ...options,
      },
      '?',
    )}`,
    {
      shape: {
        totalReservationPassengerCounts:
          TotalReservationPassengerCountsReadModelSchema.array(),
      },
    },
  );
  return res.totalReservationPassengerCounts;
};

export const useGetTotalReservationPassengerCounts = (
  options?: Partial<GetTotalReservationPassengerCountsOptions>,
) => {
  return useQuery({
    queryKey: ['reservation', 'passenger-count', options],
    queryFn: () => getTotalReservationPassengerCounts(options),
  });
};

export const getTotalReservationCounts = async ({
  baseDate = dayjs().tz().endOf('day').toISOString(),
  totalRangeDate = 1,
  intervalDays = 1,
  ...options
}: Partial<GetTotalReservationPassengerCountsOptions> = {}) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/reservations/all/total-counts${toSearchParamString(
      {
        baseDate,
        totalRangeDate,
        intervalDays,
        ...options,
      },
      '?',
    )}`,
    {
      shape: {
        totalReservationCounts: TotalReservationCountsReadModelSchema.array(),
      },
    },
  );
  return res.totalReservationCounts;
};

export const useGetTotalReservationCounts = (
  options?: Partial<GetTotalReservationPassengerCountsOptions>,
) => {
  return useQuery({
    queryKey: ['reservation', 'count', options],
    queryFn: () => getTotalReservationCounts(options),
  });
};

export const getCancelledReservationCounts = async ({
  baseDate = dayjs().tz().endOf('day').toISOString(),
  totalRangeDate = 1,
  intervalDays = 1,
  ...options
}: Partial<GetTotalReservationPassengerCountsOptions> = {}) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/reservations/all/total-cancellations${toSearchParamString(
      {
        baseDate,
        totalRangeDate,
        intervalDays,
        ...options,
      },
      '?',
    )}`,
    {
      shape: {
        totalCancellationCounts: TotalCancellationCountsReadModelSchema.array(),
      },
    },
  );
  return res.totalCancellationCounts;
};

export const useGetCancelledReservationCounts = (
  options?: Partial<GetTotalReservationPassengerCountsOptions>,
) => {
  return useQuery({
    queryKey: ['cancelled-reservation', 'count', options],
    queryFn: () => getCancelledReservationCounts(options),
  });
};

// ----- POST -----

export interface PutReservationBody {
  toDestinationShuttleRouteHubId?: string;
  fromDestinationShuttleRouteHubId?: string;
  handyStatus?: HandyStatus;
  shuttleBusId?: string;
}

export const putReservation = async (
  reservationId: string,
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
      reservationId: string;
      body: PutReservationBody;
    }) => putReservation(reservationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation'] });
      onSuccess?.();
    },
    onError,
  });
};

export const putCancelReservation = async (reservationId: string) => {
  await authInstance.put(
    `/v1/shuttle-operation/admin/reservations/${reservationId}/cancel`,
  );
};

export const usePutCancelReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: string) => putCancelReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation'] });
    },
  });
};
