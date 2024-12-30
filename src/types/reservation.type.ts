import { z } from 'zod';
import { UserSchema } from './user.type';
import { ShuttleRouteDetailSchema } from './route.type';
import { PaymentDetailSchema, PaymentSchema } from './payment.type';
import { PassengerSchema } from './passenger.type';

export const ReservationSchema = z.object({
  reservationId: z.number().int(),
  user: UserSchema,
  shuttleRoute: ShuttleRouteDetailSchema,
  type: z.enum(['TO_DESTINATION', 'FROM_DESTINATION', 'ROUND_TRIP']),
  handyStatus: z.enum(['NOT_SUPPORTED', 'SUPPORTED', 'DECLINED', 'ACCEPTED']),
  reservationStatus: z.enum([
    'NOT_PAYMENT',
    'COMPLETE_PAYMENT',
    'RESERVATION_CONFIRMED',
    'CANCEL',
  ]),
  cancelStatus: z.enum(['NONE', 'CANCEL_REQUEST', 'CANCEL_COMPLETE']),
  toDestinationShuttleRouteHubId: z.number().int().nullable(),
  fromDestinationShuttleRouteHubId: z.number().int().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  payment: PaymentSchema.nullable(),
  passengers: z.array(PassengerSchema),
});

export type ReservationType = z.infer<typeof ReservationSchema>;

export const ReservationListSchema = z.array(ReservationSchema);

export type ReservationListType = z.infer<typeof ReservationListSchema>;

export const ReservationDetailSchema = z.object({
  reservationId: z.number().int(),
  user: UserSchema,
  shuttleRoute: ShuttleRouteDetailSchema,
  type: z.enum(['TO_DESTINATION', 'FROM_DESTINATION', 'ROUND_TRIP']),
  handyStatus: z.enum(['NOT_SUPPORTED', 'SUPPORTED', 'DECLINED', 'ACCEPTED']),
  reservationStatus: z.enum([
    'NOT_PAYMENT',
    'COMPLETE_PAYMENT',
    'RESERVATION_CONFIRMED',
    'CANCEL',
  ]),
  cancelStatus: z.enum(['NONE', 'CANCEL_REQUEST', 'CANCEL_COMPLETE']),
  toDestinationHubId: z.number().int().nullable(),
  fromDestinationHubId: z.number().int().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  payment: PaymentDetailSchema, //
  passengers: z.array(PassengerSchema),
});

export type ReservationDetailType = z.infer<typeof ReservationDetailSchema>;
