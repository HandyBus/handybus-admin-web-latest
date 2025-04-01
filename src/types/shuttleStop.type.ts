import { z } from 'zod';

export const AdminCreateShuttleStopRequestSchema = z.object({
  regionHubId: z.string(),
  type: z.enum(['EVENT_DESTINATION', 'SHUTTLE_HUB']),
});

export type AdminCreateShuttleStopRequest = z.infer<
  typeof AdminCreateShuttleStopRequestSchema
>;

export const AdminSaveShuttleStopTagRequestSchema = z.object({
  regionHubId: z.string(),
  types: z.array(z.enum(['EVENT_DESTINATION', 'SHUTTLE_HUB'])),
});

export type AdminSaveShuttleStopTagRequest = z.infer<
  typeof AdminSaveShuttleStopTagRequestSchema
>;
