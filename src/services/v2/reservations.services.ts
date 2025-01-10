import { PAGINATION_LIMIT } from '@/constants/config';
import { authInstance } from '../config';
import { withPagination } from '@/types/meta/pagination.type';
import { ReservationViewEntity } from '@/types/v2/reservation.type';
import { toSearchParamString } from '@/utils/searchParam.util';
import { z } from 'zod';

interface GetReservationOption {
  page: number;
  eventId: number;
  dailyEventId: number;
  shuttleRouteId: number;
  shuttleBusId: number;
  handyStatus: z.infer<typeof ReservationViewEntity.shape.handyStatus>;
  userNickname: string;
  passengerName: string;
}

export const getReservations = async (
  option?: Partial<GetReservationOption>,
) => {
  const url = `/v2/shuttle-operation/admin/reservations?limit=${PAGINATION_LIMIT}${toSearchParamString(option, '&')}`;

  return await authInstance.get(url, {
    shape: withPagination({ reservations: ReservationViewEntity.array() }),
  });
};
