'use client';

import {
  ReservationDetailSchema,
  type UpdateReservationRequestType,
} from '@/types/v1/reservation.type';
import { authInstance } from '../config';
import { queryClient } from '@/components/Provider';

export const getReservation = async (id: number) => {
  const ret = await authInstance.get<{
    ok: boolean;
    shuttleReservation: unknown;
  }>(`/v1/shuttle-operation/admin/reservations/${id}`);
  return ReservationDetailSchema.parse(ret.shuttleReservation);
};

export const updateReservation = async (
  reservationId: number,
  input: UpdateReservationRequestType,
) => {
  const ret = await authInstance.put(
    `/v1/shuttle-operation/admin/reservations/${reservationId}`,
    input,
  );
  queryClient.invalidateQueries({ queryKey: ['reservations'] });
  return ret;
};
