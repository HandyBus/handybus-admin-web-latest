import { z } from 'zod';

export const CreateShuttleRouteRequestFormSchema = z.object({
  name: z.string(),
  reservationDeadline: z.coerce.date(),
  hasEarlybird: z.boolean(),
  earlybirdPrice: z.object({
    toDestination: z.number(),
    fromDestination: z.number(),
    roundTrip: z.number(),
  }),
  regularPrice: z.object({
    toDestination: z.number(),
    fromDestination: z.number(),
    roundTrip: z.number(),
  }),
  earlybirdDeadline: z.coerce.date(),
  maxPassengerCount: z.number(),
  shuttleRouteHubs: z.array(
    z.object({
      regionHubID: z.number(),
      type: z.enum([
        'TO_DESTINATION',
        'FROM_DESTINATION',
        '__MARKER_DESINATION_NOT_A_REAL_ROUTE__',
      ]),
      sequence: z.number(),
      arrivalTime: z.coerce.date(),
    }),
  ),
});

export type CreateShuttleRouteRequestFormType = z.infer<
  typeof CreateShuttleRouteRequestFormSchema
>;

export const CreateShuttleRouteRequestSchema = z.object({
  name: z.string(),
  reservationDeadline: z.coerce.date(),
  hasEarlybird: z.boolean(),
  earlybirdPrice: z.object({
    toDestination: z.number(),
    fromDestination: z.number(),
    roundTrip: z.number(),
  }),
  regularPrice: z.object({
    toDestination: z.number(),
    fromDestination: z.number(),
    roundTrip: z.number(),
  }),
  earlybirdDeadline: z.coerce.date(),
  maxPassengerCount: z.number(),
  shuttleRouteHubs: z.array(
    z.object({
      regionHubID: z.number(),
      type: z.enum(['TO_DESTINATION', 'FROM_DESTINATION']),
      sequence: z.number(),
      arrivalTime: z.coerce.date(),
    }),
  ),
});

export type CreateShuttleRouteRequestType = z.infer<
  typeof CreateShuttleRouteRequestSchema
>;

////////////////////////////////////////////////////////

export const RouteDetailsSchema = z.object({
  shuttleRouteID: z.number().int(),
  shuttleID: z.number().int(),
  dailyShuttleID: z.number().int(),
  name: z.number().int(),
  status: z.unknown(),
  hasEarlyBird: z.boolean(),
  earlybirdDeadline: z.unknown(),
  reservationDeadline: z.coerce.date(),
  earlybirdPriceToDestination: z.number().int().nullable(),
  earlybirdPriceFromDestination: z.number().int().nullable(),
  earlybirdPriceRoundTrip: z.number().int().nullable(),
  regularPriceToDestination: z.number().int(),
  regularPriceFromDestination: z.number().int(),
  regularPriceRoundTrip: z.number().int(),
  maxPassengerCount: z.number().int(),
  remainingSeatCount: z.number().int(),
  remainingSeatType: z.unknown(),
  // TODO
  hubs: z.object({
    pickup: z.array(z.unknown()),
    dropoff: z.array(z.unknown()),
  }),
  shuttle: z.object({}),
});
