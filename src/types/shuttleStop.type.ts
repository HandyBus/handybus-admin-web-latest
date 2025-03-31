import { z } from 'zod';

export const AdminCreateShuttleStopRequestSchema = z.object({
  regionHubId: z.string(),
  type: z.enum(['EVENT_DESTINATION', 'SHUTTLE_HUB']),
});

export type AdminCreateShuttleStopRequest = z.infer<
  typeof AdminCreateShuttleStopRequestSchema
>;

export const AdminDeleteShuttleStopRequestSchema = z.object({
  regionHubId: z.string(),
  type: z.enum(['EVENT_DESTINATION', 'SHUTTLE_HUB']),
});

export type AdminDeleteShuttleStopRequest = z.infer<
  typeof AdminDeleteShuttleStopRequestSchema
>;
