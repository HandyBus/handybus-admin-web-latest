import { z } from 'zod';
import { nullableDate } from '../meta/date.type';
import { EventsViewEntity } from './event.type';

const ShuttleRouteHubsInShuttleRoutesViewEntity = z.object({
  shuttleId: z.unknown(),
  shuttleName: z.unknown(),
  shuttleType: z.unknown(),
  regionId: z.unknown(),
  regionHubId: z.unknown(),
  shuttleStatus: z.unknown(),
  destinationName: z.unknown(),
  destinationAddress: z.unknown(),
  destinationLatitude: z.unknown(),
  destinationLongitude: z.unknown(),
  eventName: z.unknown(),
  eventImageUrl: z.unknown(),
  eventArtists: z.unknown(),
  dailyShuttles: z.unknown(),
});

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

export type ShuttleRoutesViewType = z.infer<typeof ShuttleRoutesViewEntity>;
