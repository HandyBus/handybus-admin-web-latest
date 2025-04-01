import { silentParse } from '@/utils/parse.util';
import { authInstance } from './config';
import {
  AdminCreateShuttleStopRequest,
  AdminSaveShuttleStopTagRequest,
  AdminSaveShuttleStopTagRequestSchema,
} from '@/types/shuttleStop.type';
import { AdminCreateShuttleStopRequestSchema } from '@/types/shuttleStop.type';

// ----- POST -----

export const postShuttleStop = async (data: AdminCreateShuttleStopRequest) => {
  await authInstance.post(
    '/v1/shuttle-operation/admin/shuttle-stops',
    silentParse(AdminCreateShuttleStopRequestSchema, data),
  );
};

// ----- PUT -----

export const putShuttleStop = async (data: AdminSaveShuttleStopTagRequest) => {
  await authInstance.put(
    `/v1/shuttle-operation/admin/shuttle-stop-tags`,
    silentParse(AdminSaveShuttleStopTagRequestSchema, data),
  );
};
