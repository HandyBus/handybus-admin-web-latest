import { authInstance, withPagination } from '../config';
import { ReservationViewEntity } from '@/types/v2/reservation.type';
import { PaymentEntity, TosspaymentsEntity } from '@/types/v2/payment.type';
import { toSearchParamString } from '@/utils/searchParam.util';
import { z } from 'zod';

export interface GetReservationOption {
  eventId: number | undefined;
  dailyEventId: number | undefined;
  shuttleRouteId: number | undefined;
  shuttleBusId: number | undefined;
  userNickname: string | undefined;
  passengerName: string | undefined;
  handyStatus:
    | undefined
    | z.infer<typeof ReservationViewEntity.shape.handyStatus>;
  reservationStatus:
    | undefined
    | z.infer<typeof ReservationViewEntity.shape.reservationStatus>;
  cancelStatus:
    | undefined
    | z.infer<typeof ReservationViewEntity.shape.cancelStatus>;
}

interface GetReservationOptionWithPagination extends GetReservationOption {
  page: number;
  limit: number;
}

export const getReservations = async (
  option?: Partial<GetReservationOptionWithPagination>,
) => {
  const url = `/v2/shuttle-operation/admin/reservations${toSearchParamString({ ...option }, '?')}`;

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
