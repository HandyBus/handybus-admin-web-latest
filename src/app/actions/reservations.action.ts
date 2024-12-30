'use server';

import { instance } from '@/services/config';
import { ReservationSchema } from '@/types/reservation.type';
import type { PaginationState } from '@tanstack/react-table';

import { z } from 'zod';

const ReservationResponse = z.object({
  reservations: ReservationSchema.array(),
  totalCount: z.number(),
  nextPage: z.number().nullable(),
});

import { AxiosError } from 'axios';

export const getReservations = async (
  page: PaginationState,
  shuttleId: number | undefined,
  dailyShuttleId: number | undefined,
  shuttleRouteId: number | undefined,
  userNickname: string | undefined,
  passengerName: string | undefined,
) => {
  try {
    let url = `/shuttle-operation/admin/reservations?limit=${page.pageSize}&page=${page.pageIndex}`;
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
