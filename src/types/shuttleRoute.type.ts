import { z } from 'zod';
import { EventsViewEntitySchema } from './event.type';

// ----- ENUM -----

export const TripTypeEnum = z.enum([
  'TO_DESTINATION', // 목적지행
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

// ----- GET -----

export const ShuttleRouteHubsInShuttleRoutesViewEntitySchema = z
  .object({
    shuttleRouteHubId: z.number().int(),
    regionHubId: z.number().int(),
    regionId: z.number().int(),
    name: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    type: TripTypeEnum.extract(['TO_DESTINATION', 'FROM_DESTINATION']),
    sequence: z.number().int(),
    arrivalTime: z.string(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
  })
  .strict();

export type ShuttleRouteHubsInShuttleRoutesViewEntity = z.infer<
  typeof ShuttleRouteHubsInShuttleRoutesViewEntitySchema
>;

export const ShuttleRoutesViewEntitySchema = z
  .object({
    shuttleRouteId: z.number().int(),
    eventId: z.number().int(),
    dailyEventId: z.number().int(),
    name: z.string(),
    reservationDeadline: z.string(),
    hasEarlybird: z.boolean(),
    earlybirdDeadline: z.string().nullable(),
    earlybirdPriceToDestination: z.number().int().nullable(),
    earlybirdPriceFromDestination: z.number().int().nullable(),
    earlybirdPriceRoundTrip: z.number().int().nullable(),
    regularPriceToDestination: z.number().int(),
    regularPriceFromDestination: z.number().int(),
    regularPriceRoundTrip: z.number().int(),
    remainingSeatCount: z.number().int(),
    remainingSeatType: TripTypeEnum,
    maxPassengerCount: z.number().int(),
    toDestinationCount: z.number().int(),
    fromDestinationCount: z.number().int(),
    status: ShuttleRouteStatusEnum,
    toDestinationShuttleRouteHubs:
      ShuttleRouteHubsInShuttleRoutesViewEntitySchema.array(),
    fromDestinationShuttleRouteHubs:
      ShuttleRouteHubsInShuttleRoutesViewEntitySchema.array(),
    event: EventsViewEntitySchema,
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

export type ShuttleRoutesViewEntity = z.infer<
  typeof ShuttleRoutesViewEntitySchema
>;

// ----- POST & PUT -----

export const CreateShuttleRouteRequestSchema = z
  .object({
    name: z.string(),
    reservationDeadline: z.string(),
    hasEarlybird: z.boolean(),
    earlybirdPrice: z
      .object({
        toDestination: z.number(),
        fromDestination: z.number(),
        roundTrip: z.number(),
      })
      .optional(),
    regularPrice: z.object({
      toDestination: z.number(),
      fromDestination: z.number(),
      roundTrip: z.number(),
    }),
    earlybirdDeadline: z.string().optional(),
    maxPassengerCount: z.number(),
    shuttleRouteHubs: z
      .object({
        regionHubId: z.number().int(),
        type: TripTypeEnum,
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
  shuttleRouteHubId: z.number().int().optional(),
  regionHubId: z.number().int(),
  type: TripTypeEnum.extract(['TO_DESTINATION', 'FROM_DESTINATION']),
  sequence: z.number().int().positive(),
  arrivalTime: z.string(),
});

export type UpdateShuttleRouteHubProps = z.infer<
  typeof UpdateShuttleRouteHubPropsSchema
>;

export const UpdateShuttleRouteRequestSchema = z.object({
  name: z.string(),
  reservationDeadline: z.string(),
  maxPassengerCount: z.number().int(),
  shuttleRouteHubs: UpdateShuttleRouteHubPropsSchema.array(),
});

export type UpdateShuttleRouteRequest = z.infer<
  typeof UpdateShuttleRouteRequestSchema
>;
