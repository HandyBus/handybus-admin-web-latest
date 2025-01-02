import { z } from 'zod';

import { type CreateShuttleRouteRequestType } from '@/types/route.type';

export const CreateShuttleRouteFormSchema = z.object({
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
  shuttleRouteHubsToDestination: z.array(
    z.object({
      regionHubId: z.number(),
      arrivalTime: z.coerce.date(),
    }),
  ),
  shuttleRouteHubsFromDestination: z.array(
    z.object({
      regionHubId: z.number(),
      arrivalTime: z.coerce.date(),
    }),
  ),
});

export type CreateShuttleRouteFormType = z.infer<
  typeof CreateShuttleRouteFormSchema
>;

export const conform = (
  data: CreateShuttleRouteFormType,
): CreateShuttleRouteRequestType => {
  const froms: CreateShuttleRouteRequestType['shuttleRouteHubs'] =
    data.shuttleRouteHubsFromDestination.map((v, idx) => ({
      ...v,
      sequence: idx + 1,
      type: 'FROM_DESTINATION',
    }));

  const tos: CreateShuttleRouteRequestType['shuttleRouteHubs'] =
    data.shuttleRouteHubsToDestination.map((v, idx) => ({
      ...v,
      sequence: idx + 1,
      type: 'TO_DESTINATION',
    }));

  return {
    ...data,
    shuttleRouteHubs: froms.concat(tos),
  } satisfies CreateShuttleRouteRequestType;
};
