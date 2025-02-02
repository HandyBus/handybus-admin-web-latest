import { useQuery } from '@tanstack/react-query';
import { authInstance } from './config';
import { UserStatsReadModel, UsersViewEntity } from '@/types/user.type';
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

export const getUserStats = async (userId: number) => {
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

export const useGetUserStats = (userId: number) => {
  return useQuery({
    queryKey: ['user', 'stats', userId],
    queryFn: () => getUserStats(userId),
  });
};

export const getUser = async (userId: number) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}`,
    {
      shape: {
        user: UsersViewEntity,
      },
    },
  );
  return res.user;
};

export const useGetUser = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  });
};

export const getUserCoupons = async (userId: number) => {
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

export const useGetUserCoupons = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId, 'coupon'],
    queryFn: () => getUserCoupons(userId),
  });
};

export const getUserDemands = async (
  userId: number,
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

export const useGetUserDemands = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId, 'demand'],
    queryFn: () => getUserDemands(userId),
  });
};

export const getUserPayment = async (userId: number, paymentId: number) => {
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

export const useGetUserPayment = (userId: number, paymentId: number) => {
  return useQuery({
    queryKey: ['user', userId, 'payment', paymentId],
    queryFn: () => getUserPayment(userId, paymentId),
  });
};

export const getUserReservations = async (
  userId: number,
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

export const useGetUserReservations = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId, 'reservation'],
    queryFn: () => getUserReservations(userId),
  });
};

export const getUserReservation = async (
  userId: number,
  reservationId: number,
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
  userId: number,
  reservationId: number,
) => {
  return useQuery({
    queryKey: ['user', userId, 'reservation', reservationId],
    queryFn: () => getUserReservation(userId, reservationId),
  });
};

export const getUserReviews = async (userId: number) => {
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

export const useGetUserReviews = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId, 'review'],
    queryFn: () => getUserReviews(userId),
  });
};
