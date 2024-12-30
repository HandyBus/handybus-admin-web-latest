'use server';

import { instance } from '@/services/config';
import { ReservationListSchema } from '@/types/reservation.type';

export const getReservations = async () => {
  const ret = await instance.get(
    `/shuttle-operation/admin/reservations?limit=10`,
  );
  return ReservationListSchema.parse(ret.data.reservations);
};
