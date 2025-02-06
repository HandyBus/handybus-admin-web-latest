import { z } from 'zod';
import {
  ShuttleRoutesViewEntitySchema,
  TripTypeEnum,
} from './shuttleRoute.type';

// ----- ENUM -----

export const ReservationStatusEnum = z.enum([
  'NOT_PAYMENT', // 결제 전
  'COMPLETE_PAYMENT', // 결제 완료
  'CANCEL', // 예약 취소
]);
export type ReservationStatus = z.infer<typeof ReservationStatusEnum>;

export const HandyStatusEnum = z.enum([
  'NOT_SUPPORTED', // 핸디 미지원
  'SUPPORTED', // 핸디 지원
  'DECLINED', // 핸디 거절
  'ACCEPTED', // 핸디 승인
]);
export type HandyStatus = z.infer<typeof HandyStatusEnum>;

export const CancelStatusEnum = z.enum([
  'NONE',
  'CANCEL_REQUEST', // 환불 신청
  'CANCEL_COMPLETE', // 환불 처리 완료
]);
export type CancelStatus = z.infer<typeof CancelStatusEnum>;

// ----- GET -----

export const ReservationViewEntitySchema = z
  .object({
    reservationId: z.string(),
    userId: z.string(),
    userNickname: z.string(),
    userPhoneNumber: z.string(),
    userProfileImage: z.string(),
    shuttleRouteId: z.string(),
    type: TripTypeEnum,
    fromDestinationShuttleRouteHubId: z.string().nullable(),
    toDestinationShuttleRouteHubId: z.string().nullable(),
    handyStatus: HandyStatusEnum,
    reservationStatus: ReservationStatusEnum,
    cancelStatus: CancelStatusEnum,
    paymentId: z.string().nullable(),
    paymentPrincipalAmount: z.number().int().nullable(),
    paymentAmount: z.number().int().nullable(),
    paymentDiscountAmount: z.number().int().nullable(),
    paymentCouponDiscountAmount: z.number().int().nullable(),
    paymentEarlybirdDiscountAmount: z.number().int().nullable(),
    paymentCreatedAt: z.string().nullable(),
    paymentUpdatedAt: z.string().nullable(),
    shuttleBusId: z.string().nullable(),
    passengerCount: z.number().int(),
    shuttleRoute: ShuttleRoutesViewEntitySchema,
    createdAt: z.string(),
    updatedAt: z.string(),
    hasReview: z.boolean(),
  })
  .strict();
export type ReservationViewEntity = z.infer<typeof ReservationViewEntitySchema>;
