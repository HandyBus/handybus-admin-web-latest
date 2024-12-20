import { z } from 'zod';

export const DailyShuttleStateSchema = z.enum([
  'OPEN',
  'CLOSED',
  'ENDED',
  'INACTIVE',
]);

export const DailyShuttleSchema = z.object({
  id: z.number().int(),
  date: z.coerce.date(),
  status: DailyShuttleStateSchema,
});

export type DailyShuttleType = z.infer<typeof DailyShuttleSchema>;
