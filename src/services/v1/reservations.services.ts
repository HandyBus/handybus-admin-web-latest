'use client';

import {
  ReservationDetailSchema,
  type UpdateReservationRequestType,
} from '@/types/v1/reservation.type';
import { authInstance } from '../config';
import { queryClient } from '@/components/Provider';

export const getReservation = async (id: number) => {
  const response = await authInstance.get(
    `/v1/shuttle-operation/admin/reservations/${id}`,
    {
      shape: {
        shuttleReservation: ReservationDetailSchema,
      },
    },
  );
  return response.shuttleReservation;
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
