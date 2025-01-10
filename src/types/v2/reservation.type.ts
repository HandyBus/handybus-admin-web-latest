import { z } from 'zod';
import { nullableDate } from '../meta/date.type';
import { ShuttleRoutesViewEntity } from './shuttleRoute.type';

const ReservationPassengersInReservationsViewEntity = z
  .object({
    passengerId: z.number().int(),
    passengerName: z.string(),
    passengerPhoneNumber: z.string(),
  })
  .strict();

export const ReservationViewEntity = z
  .object({
    reservationId: z.number().int(),
    userId: z.number().int(),
    userNickname: z.string(),
    userPhoneNumber: z.string(),
    userProfileImage: z.string(),
    shuttleRouteId: z.number().int(),
    type: z.enum(['TO_DESTINATION', 'FROM_DESTINATION', 'ROUND_TRIP']),
    fromDestinationShuttleRouteHubId: z.number().int().nullable(),
    toDestinationShuttleRouteHubId: z.number().int().nullable(),
    handyStatus: z.enum(['NOT_SUPPORTED', 'SUPPORTED', 'ACCEPTED', 'DECLINED']),
    reservationStatus: z.enum([
      'NOT_PAYMENT',
      'COMPLETE_PAYMENT',
      'RESERVATION_CONFIRMED',
      'CANCEL',
    ]),
    cancelStatus: z.enum(['NONE', 'CANCEL_REQUEST', 'CANCEL_COMPLETE']),
    paymentId: z.string().nullable(),
    paymentPrincipalAmount: z.number().int().nullable(),
    paymentAmount: z.number().int().nullable(),
    paymentDiscountAmount: z.number().int().nullable(),
    paymentCouponDiscountAmount: z.number().int().nullable(),
    paymentEarlybirdDiscountAmount: z.number().int().nullable(),
    paymentCreatedAt: nullableDate,
    paymentUpdatedAt: nullableDate,
    shuttleBusId: z.number().int().nullable(),
    passengers: ReservationPassengersInReservationsViewEntity.array(),
    shuttleRoute: ShuttleRoutesViewEntity,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    hasReview: z.boolean(),
  })
  .strict();

export type ReservationViewType = z.infer<typeof ReservationViewEntity>;
