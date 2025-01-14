import { authInstance } from '../config';
import {
  CreateBusRequestSchema,
  ShuttleBusesViewEntity,
} from '@/types/v2/shuttleBus.type';

export const readBuses = async (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
) => {
  const response = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses`,
    {
      shape: { shuttleBuses: ShuttleBusesViewEntity.array() },
    },
  );
  return response.shuttleBuses;
};

import { CreateBusRequest } from '@/types/v2/shuttleBus.type';
import { silentParse } from '@/utils/parse.util';

export const createBus = async (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
  input: CreateBusRequest,
) => {
  return await authInstance.post(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses`,
    silentParse(CreateBusRequestSchema, input),
  );
};
