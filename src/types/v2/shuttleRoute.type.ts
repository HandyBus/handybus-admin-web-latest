import { z } from 'zod';
import { nullableDate } from '../meta/common.type';
import { EventsViewEntity } from './event.type';

const ShuttleRouteHubsInShuttleRoutesViewEntity = z
  .object({
    shuttleRouteHubId: z.unknown(),
    regionHubId: z.unknown(),
    name: z.unknown(),
    address: z.unknown(),
    latitude: z.unknown(),
    longitude: z.unknown(),
    type: z.unknown(),
    sequence: z.unknown(),
    arrivalTime: z.unknown(),
    status: z.unknown(),
  })
  .strict();

export type ShuttleRouteHubsInShuttleRoutesView = z.infer<
  typeof ShuttleRouteHubsInShuttleRoutesViewEntity
>;

export const ShuttleRoutesViewEntity = z
  .object({
    shuttleRouteId: z.number().int(),
    eventId: z.number().int(),
    dailyEventId: z.number().int(),
    name: z.string(),
    reservationDeadline: z.coerce.date(),
    hasEarlybird: z.boolean(),
    earlybirdDeadline: nullableDate,
    earlybirdPriceToDestination: z.number().int().nullable(),
    earlybirdPriceFromDestination: z.number().int().nullable(),
    earlybirdPriceRoundTrip: z.number().int().nullable(),
    regularPriceToDestination: z.number().int(),
    regularPriceFromDestination: z.number().int(),
    regularPriceRoundTrip: z.number().int(),
    remainingSeatCount: z.number().int(),
    remainingSeatType: z.enum([
      'TO_DESTINATION',
      'FROM_DESTINATION',
      'ROUND_TRIP',
    ]),
    maxPassengerCount: z.number().int(),
    toDestinationCount: z.number().int(),
    fromDestinationCount: z.number().int(),
    status: z.enum([
      'OPEN',
      'CLOSED',
      'CONFIRMED',
      'ENDED',
      'CANCELLED',
      'INACTIVE',
    ]),
    toDestinationShuttleRouteHubs:
      ShuttleRouteHubsInShuttleRoutesViewEntity.array(),
    fromDestinationShuttleRouteHubs:
      ShuttleRouteHubsInShuttleRoutesViewEntity.array(),
    // TODO remove .nullable() after fixing the api
    event: EventsViewEntity.optional(),
  })
  .strict();

export type ShuttleRoutesView = z.infer<typeof ShuttleRoutesViewEntity>;

//////////////////////// create request ////////////////////////

export const CreateShuttleRouteRequestSchema = z
  .object({
    name: z.unknown(),
    reservationDeadline: z.unknown(),
    hasEarlybird: z.unknown(),
    earlybirdPrice: z.unknown(),
    regularPrice: z.unknown(),
    earlybirdDeadline: z.unknown(),
    maxPassengerCount: z.unknown(),
    shuttleRouteHubs: z.unknown(),
  })
  .strict();

export type CreateShuttleRouteRequest = z.infer<
  typeof CreateShuttleRouteRequestSchema
>;
