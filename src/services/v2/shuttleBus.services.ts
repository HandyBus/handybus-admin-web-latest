import { authInstance } from '../config';
import {
  AssignBusRequest,
  AssignBusRequestSchema,
  CreateBusRequestSchema,
  ShuttleBusesViewEntity,
} from '@/types/v2/shuttleBus.type';

export const getBuses = async (
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

export const postBus = async (
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

export const postAssignBus = async (
  eventId: number,
  dailyEventId: number,
  shuttleRouteId: number,
  input: AssignBusRequest,
) => {
  return await authInstance.post(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses/bulk-assign`,
    silentParse(AssignBusRequestSchema, input),
  );
};
