import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { authInstance } from './config';
import { withPagination } from '@/types/common.type';
import {
  AgeRange,
  Gender,
  UserStatsReadModel,
  UsersViewEntitySchema,
} from '@/types/user.type';
import { IssuedCouponsViewEntity } from '@/types/coupon.type';
import {
  ShuttleDemandStatus,
  ShuttleDemandsViewEntitySchema,
} from '@/types/demand.type';
import {
  PaymentsViewEntitySchema,
  TossPaymentsEntitySchema,
} from '@/types/payment.type';
import { toSearchParamString } from '@/utils/searchParam.util';
import { ShuttleRouteStatus } from '@/types/shuttleRoute.type';
import {
  ReservationStatus,
  ReservationViewEntitySchema,
} from '@/types/reservation.type';
import { ReviewsViewEntitySchema } from '@/types/reviews.type';
import { ActiveStatus } from '@/types/common.type';
import dayjs from 'dayjs';
import {
  DashboardOptions,
  TotalUserCountsReadModelSchema,
} from '@/types/dashboard.type';

export interface GetUsersOptions {
  nickname?: string;
  phoneNumber?: string;
  gender?: Gender;
  ageRange?: AgeRange;
  regionId?: string;
  // authChannelType?: AuthChannelType;
  orderBy?: 'nickname'; // orderBy 쿼리 퍼포먼스가 좋지 않기에 기본값으로 사용하는 건 권장하지 않음
  additionalOrderOptions?: 'ASC' | 'DESC'; // orderBy 와 additionalOrderOptions은 항상 함께 전달해야 함
  status?: ActiveStatus;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  marketingConsent?: boolean;
  serviceTermsAgreement?: boolean;
  personalInfoConsent?: boolean;
  onboardingComplete?: boolean;
  paymentComplete?: boolean;
}

export interface GetUsersOptionsWithPagination extends GetUsersOptions {
  page: string | undefined;
  limit?: number; // 최대 50, 없으면 전체 조회
}

export const getUsers = async (option?: GetUsersOptionsWithPagination) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users${toSearchParamString({ ...option }, '?')}`,
    {
      shape: withPagination({
        users: UsersViewEntitySchema.array(),
      }),
    },
  );
  return res;
};

export const useGetUsersWithPagination = (
  option?: GetUsersOptionsWithPagination,
) =>
  useInfiniteQuery({
    queryKey: ['user', option],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getUsers({ ...option, page: pageParam }),
    initialPageParam: undefined,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    placeholderData: keepPreviousData,
  });

export const getUser = async (userId: string) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}`,
    {
      shape: {
        user: UsersViewEntitySchema,
      },
    },
  );
  return res.user;
};

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  });
};

export const getUserStats = async (userId: string) => {
  const res = await authInstance.get(
    `/v1/user-management/admin/users/${userId}/stats`,
    {
      shape: {
        userStats: UserStatsReadModel,
      },
    },
  );
  return res.userStats;
};

export const useGetUserStats = (userId: string) => {
  return useQuery({
    queryKey: ['user', 'stats', userId],
    queryFn: () => getUserStats(userId),
  });
};

export const getUserCoupons = async (userId: string) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}/coupons`,
    {
      shape: {
        issuedCoupons: IssuedCouponsViewEntity.array(),
      },
    },
  );
  return res.issuedCoupons;
};

export const useGetUserCoupons = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId, 'coupon'],
    queryFn: () => getUserCoupons(userId),
  });
};

export const getUserDemands = async (
  userId: string,
  params?: { status?: ShuttleDemandStatus },
) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}/demands${toSearchParamString(params, '?')}`,
    {
      shape: {
        shuttleDemands: ShuttleDemandsViewEntitySchema.array(),
      },
    },
  );
  return res.shuttleDemands;
};

export const useGetUserDemands = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId, 'demand'],
    queryFn: () => getUserDemands(userId),
  });
};

export const getUserPayment = async (userId: string, paymentId: string) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}/payments/${paymentId}`,
    {
      shape: {
        payments: PaymentsViewEntitySchema.nullable(),
        tossPayments: TossPaymentsEntitySchema.nullable(),
      },
    },
  );
  return res;
};

export const useGetUserPayment = (userId: string, paymentId: string) => {
  return useQuery({
    queryKey: ['user', userId, 'payment', paymentId],
    queryFn: () => getUserPayment(userId, paymentId),
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

export const getUserReviews = async (userId: string) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}/reviews`,
    {
      shape: {
        reviews: ReviewsViewEntitySchema.array(),
      },
    },
  );
  return res.reviews;
};

export const useGetUserReviews = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId, 'review'],
    queryFn: () => getUserReviews(userId),
  });
};

export const getTotalUserCounts = async ({
  baseDate = dayjs().tz().endOf('day').toISOString(),
  totalRangeDate = 6,
  intervalDays = 1,
}: Partial<DashboardOptions> = {}) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/all/total-counts${toSearchParamString(
      {
        baseDate,
        totalRangeDate,
        intervalDays,
      },
      '?',
    )}`,
    {
      shape: {
        totalUserCounts: TotalUserCountsReadModelSchema.array(),
      },
    },
  );
  return res.totalUserCounts;
};

export const useGetTotalUserCounts = (options?: Partial<DashboardOptions>) => {
  return useQuery({
    queryKey: ['user', 'count', options],
    queryFn: () => getTotalUserCounts(options),
  });
};
