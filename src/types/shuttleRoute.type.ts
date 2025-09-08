import { z } from 'zod';
import { EventsViewEntitySchema } from './event.type';
import { ActiveStatusEnum } from './common.type';

// ----- ENUM -----

export const TripTypeEnum = z.enum([
  'TO_DESTINATION', // 행사장행
  'FROM_DESTINATION', // 귀가행
  'ROUND_TRIP', // 왕복행
]);
export type TripType = z.infer<typeof TripTypeEnum>;

export const ShuttleRouteStatusEnum = z.enum([
  'OPEN', // 예약 모집 중
  'CLOSED', // 예약 마감
  'ENDED', // 운행 종료
  'CANCELLED', // 무산
  'INACTIVE', // 비활성
]);
export type ShuttleRouteStatus = z.infer<typeof ShuttleRouteStatusEnum>;

export const ShuttleRouteHubRoleEnum = z.enum([
  'HUB', // 허브
  'DESTINATION', // 목적지
]);
export type ShuttleRouteHubRole = z.infer<typeof ShuttleRouteHubRoleEnum>;

// ----- GET -----

export const ShuttleRouteHubsInShuttleRoutesViewEntitySchema = z
  .object({
    shuttleRouteHubId: z.string(),
    regionHubId: z.string(),
    regionId: z.string(),
    name: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    role: ShuttleRouteHubRoleEnum,
    type: TripTypeEnum.exclude(['ROUND_TRIP']),
    sequence: z.number().int(),
    arrivalTime: z.string(),
    status: ActiveStatusEnum,
  })
  .strict();
export type ShuttleRouteHubsInShuttleRoutesViewEntity = z.infer<
  typeof ShuttleRouteHubsInShuttleRoutesViewEntitySchema
>;

export const AdminShuttleRoutesViewEntitySchema = z
  .object({
    shuttleRouteId: z.string(),
    eventId: z.string(),
    dailyEventId: z.string(),
    name: z.string(),
    reservationDeadline: z.string(),
    hasEarlybird: z.boolean(),
    earlybirdDeadline: z.string().nullable(),
    earlybirdPriceToDestination: z.number().int().nullable(),
    earlybirdPriceFromDestination: z.number().int().nullable(),
    earlybirdPriceRoundTrip: z.number().int().nullable(),
    regularPriceToDestination: z.number().int().nullable(),
    regularPriceFromDestination: z.number().int().nullable(),
    regularPriceRoundTrip: z.number().int().nullable(),
    remainingSeatCount: z.number().int(),
    remainingSeatType: TripTypeEnum,
    maxPassengerCount: z.number().int(),
    toDestinationCount: z.number().int().nullable(),
    fromDestinationCount: z.number().int().nullable(),
    status: ShuttleRouteStatusEnum,
    toDestinationShuttleRouteHubs:
      ShuttleRouteHubsInShuttleRoutesViewEntitySchema.array(),
    fromDestinationShuttleRouteHubs:
      ShuttleRouteHubsInShuttleRoutesViewEntitySchema.array(),
    event: z.lazy(() => EventsViewEntitySchema),
    createdAt: z.string(),
    updatedAt: z.string(),
    shuttleRouteMetadata: z.record(z.string(), z.any()).nullable().optional(),
  })
  .strict();
export type AdminShuttleRoutesViewEntity = z.infer<
  typeof AdminShuttleRoutesViewEntitySchema
>;

export const ShuttleRouteAlertRequestsViewEntitySchema = z.object({
  shuttleRouteAlertRequestId: z.string(),
  shuttleRouteId: z.string(),
  userId: z.string(),
  userNickname: z.string(),
  userName: z.string(),
  userPhoneNumber: z.string(),
  userProfileImage: z.string(),
  shuttleRouteHubId: z.string().nullable(),
  notifiedAt: z.string().nullable(),
  notificationRequestedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  queueIndex: z.number(),
  shuttleRoute: AdminShuttleRoutesViewEntitySchema,
});
export type ShuttleRouteAlertRequestsViewEntity = z.infer<
  typeof ShuttleRouteAlertRequestsViewEntitySchema
>;

// ----- POST -----

export const CreateShuttleRouteRequestSchema = z
  .object({
    name: z.string(),
    reservationDeadline: z.string(),
    hasEarlybird: z.boolean(),
    earlybirdPrice: z
      .object({
        toDestination: z.number().nullable(),
        fromDestination: z.number().nullable(),
        roundTrip: z.number().nullable(),
      })
      .optional(),
    regularPrice: z.object({
      toDestination: z.number().nullable(),
      fromDestination: z.number().nullable(),
      roundTrip: z.number().nullable(),
    }),
    earlybirdDeadline: z.string().optional(),
    maxPassengerCount: z.number(),
    shuttleRouteHubs: z
      .object({
        regionHubId: z.string(),
        type: TripTypeEnum,
        role: ShuttleRouteHubRoleEnum,
        sequence: z.number().int().positive(),
        arrivalTime: z.string(),
      })
      .array(),
  })
  .strict();
export type CreateShuttleRouteRequest = z.infer<
  typeof CreateShuttleRouteRequestSchema
>;

export const UpdateShuttleRouteHubPropsSchema = z.object({
  shuttleRouteHubId: z.string().optional(),
  regionHubId: z.string(),
  type: TripTypeEnum.exclude(['ROUND_TRIP']),
  role: ShuttleRouteHubRoleEnum,
  sequence: z.number().int().positive(),
  arrivalTime: z.string(),
});
export type UpdateShuttleRouteHubProps = z.infer<
  typeof UpdateShuttleRouteHubPropsSchema
>;

export const UpdateShuttleRouteRequestSchema = z.object({
  name: z.string().optional(),
  reservationDeadline: z.string().optional(),
  maxPassengerCount: z.number().int().optional(),
  shuttleRouteHubs: UpdateShuttleRouteHubPropsSchema.array().optional(),
  regularPrice: z
    .object({
      roundTrip: z.number().int().optional(),
      toDestination: z.number().int().optional(),
      fromDestination: z.number().int().optional(),
    })
    .optional(),
  earlybirdPrice: z
    .object({
      roundTrip: z.number().int().optional(),
      toDestination: z.number().int().optional(),
      fromDestination: z.number().int().optional(),
    })
    .optional(),
});
export type UpdateShuttleRouteRequest = z.infer<
  typeof UpdateShuttleRouteRequestSchema
>;
