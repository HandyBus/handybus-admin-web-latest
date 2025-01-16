import { authInstance, withPagination } from '../config';
import { ReservationViewEntity } from '@/types/v2/reservation.type';
import { PaymentEntity, TosspaymentsEntity } from '@/types/v2/payment.type';
import { toSearchParamString } from '@/utils/searchParam.util';
import { z } from 'zod';

interface GetReservationOption {
  page: number;
  limit: number;
  eventId: number;
  dailyEventId: number;
  shuttleRouteId: number;
  shuttleBusId: number;
  handyStatus: z.infer<typeof ReservationViewEntity.shape.handyStatus>;
  reservationStatus: z.infer<
    typeof ReservationViewEntity.shape.reservationStatus
  >;
  userNickname: string;
  passengerName: string;
}

export const getReservations = async (
  option?: Partial<GetReservationOption>,
) => {
  const url = `/v2/shuttle-operation/admin/reservations${toSearchParamString(option, '?')}`;

  return await authInstance.get(url, {
    shape: withPagination({ reservations: ReservationViewEntity.array() }),
  });
};

export const getReservationAndPayments = async (reservationId: number) => {
  const response = await authInstance.get(
    `/v2/shuttle-operation/admin/reservations/${reservationId}`,
    {
      shape: {
        reservation: ReservationViewEntity,
        payment: PaymentEntity,
        tossPayments: TosspaymentsEntity,
      },
    },
  );
  return response;
};
