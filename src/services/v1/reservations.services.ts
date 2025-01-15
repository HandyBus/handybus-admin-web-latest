'use client';

import { type UpdateReservationRequestType } from '@/types/v1/reservation.type';
import { authInstance } from '../config';
import { queryClient } from '@/components/Provider';

// TODO : v2 api가 준비되면 migrate
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
