import { z } from 'zod';

import { CreateShuttleRouteRequest } from '@/types/v2/shuttleRoute.type';
import { formatDate } from '@/utils/date.util';

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

export type CreateShuttleRouteForm = z.infer<
  typeof CreateShuttleRouteFormSchema
>;

export const conform = (
  data: CreateShuttleRouteForm,
): CreateShuttleRouteRequest => {
  const froms: CreateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsFromDestination.map((v, idx) => ({
      ...v,
      sequence: idx + 1,
      type: 'FROM_DESTINATION',
      arrivalTime: formatDate(v.arrivalTime, 'datetime'),
    })) satisfies CreateShuttleRouteRequest['shuttleRouteHubs'];

  const tos: CreateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsToDestination.map((v, idx) => ({
      ...v,
      sequence: idx + 1,
      type: 'TO_DESTINATION',
      arrivalTime: formatDate(v.arrivalTime, 'datetime'),
    })) satisfies CreateShuttleRouteRequest['shuttleRouteHubs'];

  const x = {
    ...data,
    shuttleRouteHubs: froms.concat(tos),
    reservationDeadline: formatDate(data.reservationDeadline, 'datetime'),
    earlybirdDeadline: data.earlybirdDeadline
      ? formatDate(data.earlybirdDeadline, 'datetime')
      : null,
  };
  return x;
};
