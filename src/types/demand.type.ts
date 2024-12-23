import { z } from 'zod';

export const ShuttleDemand = z.object({
  ID: z.number().int(),
  userID: z.number().int(),
  regionID: z.number().int(),
  shuttleID: z.number().int(),
  dailyShuttleID: z.number().int(),
  type: z.unknown(),
  passengerCount: z.number().int(),
});

export const ShuttleDemands = z.array(ShuttleDemand);

export const ShuttleDemandStats = z.object({
  roundTripCount: z.number().int(),
  toConcertCount: z.number().int(),
  fromConcertCount: z.number().int(),
});

export type ShuttleDemandStatsType = z.infer<typeof ShuttleDemandStats>;