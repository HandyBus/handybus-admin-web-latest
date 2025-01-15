import { authInstance } from '../config';
import {
  CreateShuttleRouteRequestSchema,
  CreateShuttleRouteRequest,
  ShuttleRoutesViewEntity,
  type ShuttleRoutesView,
} from '@/types/v2/shuttleRoute.type';

interface GetRouteFilter {
  status: ShuttleRoutesView['status'];
  provinceFullName: string;
  provinceShortName: string;
  cityFullName: string;
  cityShortName: string;
}

export const getRoutes = async (
  shuttleId: number,
  dailyShuttleId: number,
  filter?: Partial<GetRouteFilter>,
) => {
  const response = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${shuttleId}/dates/${dailyShuttleId}/routes?${new URLSearchParams(filter)}`,
    {
      shape: {
        shuttleRoutes: ShuttleRoutesViewEntity.array(),
      },
    },
  );
  return response.shuttleRoutes;
};

export const getRoute = async (
  eventId: number,
  dailyEventId: number,
  routeId: number,
) => {
  const response = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${routeId}`,
    {
      shape: { shuttleRoute: ShuttleRoutesViewEntity },
    },
  );
  return response.shuttleRoute;
};

////////////////// create route //////////////////

import { queryClient } from '@/components/Provider';
import { silentParse } from '@/utils/parse.util';
import { z } from 'zod';

export const postRoute = async (
  eventId: number,
  dailyEventId: number,
  input: CreateShuttleRouteRequest,
) => {
  const response = await authInstance.post(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes`,
    silentParse(CreateShuttleRouteRequestSchema, input),
    {
      shape: { shuttleRouteId: z.number().int() },
    },
  );
  queryClient.invalidateQueries({
    queryKey: ['routes', eventId, dailyEventId],
  });
  return response;
};
