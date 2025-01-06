import { z } from 'zod';

export const ShuttleDemand = z.object({
  shuttleDemandId: z.number().int(),
  userId: z.number().int(),
  regionId: z.number().int(),
  shuttleId: z.number().int(),
  dailyShuttleId: z.number().int(),
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
