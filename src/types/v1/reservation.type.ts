import { z } from 'zod';
import { UserSchema } from './user.type';
import { ShuttleRouteDetailSchema } from './route.type';
import { PaymentSchema } from './payment.type';
import { PassengerSchema, FlatPassengerSchema } from './passenger.type';
import { nullableDate } from '../meta/common.type';

export const ReservationSchema = z
  .object({
    reservationId: z.number().int(),
    userId: UserSchema.shape.userId,
    userNickname: UserSchema.shape.nickname,
    userPhoneNumber: UserSchema.shape.phoneNumber,
    userProfileImage: UserSchema.shape.profileImage,
    shuttleRouteId: ShuttleRouteDetailSchema.shape.shuttleRouteId,
    type: z.enum(['TO_DESTINATION', 'FROM_DESTINATION', 'ROUND_TRIP']),
    toDestinationShuttleRouteHubId: z.number().int().nullable(),
    fromDestinationShuttleRouteHubId: z.number().int().nullable(),
    handyStatus: z.enum(['NOT_SUPPORTED', 'SUPPORTED', 'DECLINED', 'ACCEPTED']),
    reservationStatus: z.enum(['NOT_PAYMENT', 'COMPLETE_PAYMENT', 'CANCEL']),
    cancelStatus: z.enum(['NONE', 'CANCEL_REQUEST', 'CANCEL_COMPLETE']),
    paymentId: PaymentSchema.shape.paymentId.nullable(),
    paymentPrincipalAmount: PaymentSchema.shape.principalAmount.nullable(),
    paymentAmount: PaymentSchema.shape.paymentAmount.nullable(),
    paymentDiscountAmount: PaymentSchema.shape.discountAmount.nullable(),
    paymentCouponDiscountAmount:
      PaymentSchema.shape.couponDiscountAmount.nullable(),
    paymentEarlybirdDiscountAmount:
      PaymentSchema.shape.earlybirdDiscountAmount.nullable(),
    paymentCreatedAt: nullableDate,
    paymentUpdatedAt: nullableDate,
    shuttleBusId: z.number().int().nullable(),
    passengers: FlatPassengerSchema.array(),
    shuttleRoute: z
      .object({
        shuttleRouteId: z.number().int(),
        shuttleId: z.number().int(),
        dailyShuttleId: z.number().int(),
        name: z.string(),
        status: z.string(), // TODO
        hasEarlybird: z.boolean(),
        earlybirdDeadline: nullableDate,
        reservationDeadline: z.coerce.date(),
        earlybirdPriceToDestination: z.number().int().nullable(),
        earlybirdPriceFromDestination: z.number().int().nullable(),
        earlybirdPriceRoundTrip: z.number().int().nullable(),
        regularPriceToDestination: z.number().int(),
        regularPriceFromDestination: z.number().int(),
        regularPriceRoundTrip: z.number().int(),
        maxPassengerCount: z.number().int(),
        toDestinationCount: z.number().int(),
        fromDestinationCount: z.number().int(),
        fromDestinationShuttleRouteHubs: z
          .object({
            name: z.string(),
            regionHubId: z.number().int(),
            shuttleRouteHubId: z.number().int(),
            latitude: z.number(),
            longitude: z.number(),
            address: z.string(),
            type: z.unknown(),
            arrivalTime: z.coerce.date(),
            sequence: z.number(),
            status: z.unknown(),
          })
          .strict()
          .array(),
        toDestinationShuttleRouteHubs: z
          .object({
            name: z.string(),
            regionHubId: z.number().int(),
            shuttleRouteHubId: z.number().int(),
            latitude: z.number(),
            longitude: z.number(),
            address: z.string(),
            type: z.unknown(),
            arrivalTime: z.coerce.date(),
            sequence: z.number(),
            status: z.unknown(),
          })
          .strict()
          .array(),
        shuttleEvent: z.unknown(),
      })
      .strict(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .strict();

export type ReservationType = z.infer<typeof ReservationSchema>;

export const HANDY_STATUS = [
  'NOT_SUPPORTED',
  'SUPPORTED',
  'DECLINED',
  'ACCEPTED',
] as const;

export const HandyStatusSchema = z.enum(HANDY_STATUS);

export type HandyStatusType = z.infer<typeof HandyStatusSchema>;

type ExactEnum<T, TEnum extends T = T> = T extends TEnum
  ? TEnum extends T
    ? T extends TEnum
      ? T
      : never
    : never
  : never;

const a: ExactEnum<'a' | 'b' | 'd'> = 'a';

function f(x: ExactEnum<'a' | 'b' | 'c'>): ExactEnum<'a' | 'b' | 'c'> {
  return x;
}

const b = f('a');
const c = f(a);

console.log(b, c);

export const ReservationDetailSchema = z
  .object({
    reservationId: z.number().int(),
    user: z.unknown(),
    shuttleRoute: ShuttleRouteDetailSchema,
    type: z.enum(['TO_DESTINATION', 'FROM_DESTINATION', 'ROUND_TRIP']),
    handyStatus: HandyStatusSchema,
    reservationStatus: z.enum(['NOT_PAYMENT', 'COMPLETE_PAYMENT', 'CANCEL']),
    cancelStatus: z.enum(['NONE', 'CANCEL_REQUEST', 'CANCEL_COMPLETE']),
    toDestinationShuttleRouteHubId: z.number().int().nullable(),
    fromDestinationShuttleRouteHubId: z.number().int().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    payment: z.unknown(),
    passengers: z.array(PassengerSchema),
  })
  .strict();

export type ReservationDetailType = z.infer<typeof ReservationDetailSchema>;

//////////////////////

export const UpdateReservationRequestSchema = z.object({
  toDestinationShuttleRouteHubId: z.number().int().nullable().optional(),
  fromDestinationShuttleRouteHubId: z.number().int().nullable().optional(),
  handyStatus: HandyStatusSchema.optional(),
});

export type UpdateReservationRequestType = z.infer<
  typeof UpdateReservationRequestSchema
>;
