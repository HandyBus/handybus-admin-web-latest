import { silentParse } from '@/utils/parse.util';
import { authInstance } from './config';
import {
  AdminCreateShuttleStopRequest,
  AdminDeleteShuttleStopRequest,
  AdminDeleteShuttleStopRequestSchema,
} from '@/types/shuttleStop.type';
import { AdminCreateShuttleStopRequestSchema } from '@/types/shuttleStop.type';

// ----- POST -----

export const postShuttleStop = async (data: AdminCreateShuttleStopRequest) => {
  await authInstance.post(
    '/v1/shuttle-operation/admin/shuttle-stops',
    silentParse(AdminCreateShuttleStopRequestSchema, data),
  );
};

// ----- DELETE -----

export const deleteShuttleStop = async (
  data: AdminDeleteShuttleStopRequest,
) => {
  await authInstance.delete(
    `/v1/shuttle-operation/admin/shuttle-stops`,
    silentParse(AdminDeleteShuttleStopRequestSchema, data),
  );
};
