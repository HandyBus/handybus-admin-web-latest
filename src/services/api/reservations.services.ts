'use client';

import {
  ReservationDetailSchema,
  ReservationSchema,
  type UpdateReservationRequestType,
} from '@/types/reservation.type';
import { PaginationResponseSchema } from '@/types/meta/pagination.type';
import { PAGINATION_LIMIT } from '@/constants/config';
import { authInstance } from '../new-fetch';
import { queryClient } from '@/components/Provider';

const ReservationResponse = PaginationResponseSchema(
  ReservationSchema.array(),
  'reservations',
);

export const getReservations = async (
  pageIndex: number | undefined,
  shuttleId: number | undefined,
  dailyShuttleId: number | undefined,
  shuttleRouteId: number | undefined,
  userNickname: string | undefined,
  passengerName: string | undefined,
) => {
  let url = `/shuttle-operation/admin/reservations?limit=${PAGINATION_LIMIT}`;
  if (pageIndex !== undefined && pageIndex !== null)
    url = url.concat(`&page=${pageIndex}`);
  if (shuttleId !== undefined && shuttleId !== null)
    url = url.concat(`&shuttleId=${shuttleId}`);
  if (dailyShuttleId !== undefined && dailyShuttleId !== null)
    url = url.concat(`&dailyShuttleId=${dailyShuttleId}`);
  if (shuttleRouteId !== undefined && shuttleRouteId !== null)
    url = url.concat(`&shuttleRouteId=${shuttleRouteId}`);
  if (userNickname !== undefined && userNickname !== null)
    url = url.concat(`&userNickname=${userNickname}`);
  if (passengerName !== undefined && passengerName !== null)
    url = url.concat(`&passengerName=${passengerName}`);

  const ret = await authInstance.get(url);
  return ReservationResponse.parse(ret);
};

export const getReservation = async (id: number) => {
  const ret = await authInstance.get<{
    ok: boolean;
    shuttleReservation: unknown;
  }>(`/shuttle-operation/admin/reservations/${id}`);
  return ReservationDetailSchema.parse(ret.shuttleReservation);
};

export const updateReservation = async (
  reservationId: number,
  input: UpdateReservationRequestType,
) => {
  const ret = await authInstance.put(
    `/shuttle-operation/admin/reservations/${reservationId}`,
    input,
  );
  queryClient.invalidateQueries({ queryKey: ['reservations'] });
  return ret;
};
