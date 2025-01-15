import { z } from 'zod';
import { EventsViewEntity } from './event.type';

const ShuttleRouteHubsInShuttleRoutesViewEntity = z
  .object({
    shuttleRouteHubId: z.number().int(),
    regionHubId: z.number().int(),
    name: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    type: z.enum(['TO_DESTINATION', 'FROM_DESTINATION', 'ROUND_TRIP']),
    sequence: z.number().int(),
    arrivalTime: z.string(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
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
    name: z.string(),
    reservationDeadline: z.string(), // TODO not use corece.date() ?
    hasEarlybird: z.boolean(),
    // nullable or undefined-able or .optional?
    earlybirdPrice: z
      .object({
        toDestination: z.number(),
        fromDestination: z.number(),
        roundTrip: z.number(),
      })
      .nullable(),
    regularPrice: z.object({
      toDestination: z.number(),
      fromDestination: z.number(),
      roundTrip: z.number(),
    }),
    // optional or nullable
    earlybirdDeadline: z.string().nullable(),
    maxPassengerCount: z.number(),
    shuttleRouteHubs: z
      .object({
        regionHubId: z.number().int(),
        type: z.enum(['TO_DESTINATION', 'FROM_DESTINATION', 'ROUND_TRIP']),
        sequence: z.number().int().positive(),
        arrivalTime: z.string(),
      })
      .array(),
  })
  .strict();

export type CreateShuttleRouteRequest = z.infer<
  typeof CreateShuttleRouteRequestSchema
>;
