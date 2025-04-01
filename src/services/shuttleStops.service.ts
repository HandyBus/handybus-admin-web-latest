import { silentParse } from '@/utils/parse.util';
import { authInstance } from './config';
import {
  AdminSaveShuttleStopTagRequest,
  AdminSaveShuttleStopTagRequestSchema,
} from '@/types/shuttleStop.type';

// ----- PUT -----

export const putShuttleStop = async (data: AdminSaveShuttleStopTagRequest) => {
  await authInstance.put(
    `/v1/shuttle-operation/admin/shuttle-stop-tags`,
    silentParse(AdminSaveShuttleStopTagRequestSchema, data),
  );
};
