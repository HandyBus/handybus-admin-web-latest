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
  shuttleRouteHubs: z.array(
    z.object({
      regionHubId: z.number(),
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

export type CreateShuttleRouteFormType = z.infer<
  typeof CreateShuttleRouteFormSchema
>;

export const conform = (
  data: CreateShuttleRouteFormType,
): CreateShuttleRouteRequestType => {
  return {
    ...data,
    shuttleRouteHubs: data.shuttleRouteHubs.filter(
      (h) => h.type !== '__MARKER_DESINATION_NOT_A_REAL_ROUTE__',
    ) as CreateShuttleRouteRequestType['shuttleRouteHubs'],
  } satisfies CreateShuttleRouteRequestType;
};
