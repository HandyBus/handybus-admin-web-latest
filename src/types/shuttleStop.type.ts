import { z } from 'zod';
import { HubUsageTypeEnum } from './hub.type';

export const AdminSaveShuttleStopTagRequestSchema = z.object({
  regionHubId: z.string(),
  types: z.array(HubUsageTypeEnum),
});

export type AdminSaveShuttleStopTagRequest = z.infer<
  typeof AdminSaveShuttleStopTagRequestSchema
>;
