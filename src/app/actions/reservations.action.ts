'use server';

import { instance } from '@/services/config';
import { ReservationSchema } from '@/types/reservation.type';
import { AxiosError } from 'axios';
import { PaginationResponseSchema } from '@/types/meta/pagination.type';
import { PAGINATION_LIMIT } from '@/constants/config';

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
  try {
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

    const ret = await instance.get(url);
    return ReservationResponse.parse(ret.data);
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      throw e.response.data;
    }
    throw e;
  }
};

export const getReservation = async (id: number) => {
  try {
    const ret = await instance.get(
      `/shuttle-operation/admin/reservations/${id}`,
    );
    return ReservationSchema.parse(ret.data.shuttleReservation);
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      throw e.response.data;
    }
    throw e;
  }
};
