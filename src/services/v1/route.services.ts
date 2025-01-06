'use client';

import {
  CreateShuttleRouteRequestType,
  ShuttleRouteDetailSchema,
} from '@/types/v1/route.type';
import { authInstance } from '../config';
import { queryClient } from '@/components/Provider';

export const addRoute = async (
  shuttleId: number,
  dailyShuttleId: number,
  input: CreateShuttleRouteRequestType,
) => {
  const response = await authInstance.post(
    `/v1/shuttle-operation/admin/shuttles/${shuttleId}/dates/${dailyShuttleId}/routes`,
    input,
  );
  queryClient.invalidateQueries({
    queryKey: ['routes', shuttleId, dailyShuttleId],
  });
  return response;
};

export const getRoute = async (
  shuttleId: number,
  dailyShuttleId: number,
  routeId: number,
) => {
  const response = await authInstance.get<{
    ok: boolean;
    shuttleRouteDetail: unknown;
  }>(
    `/v1/shuttle-operation/admin/shuttles/${shuttleId}/dates/${dailyShuttleId}/routes/${routeId}`,
  );
  return ShuttleRouteDetailSchema.parse(response.shuttleRouteDetail);
};

export const confirmRoute = async (
  shuttleId: number,
  dailyShuttleId: number,
  routeId: number,
) => {
  const response = await authInstance.put(
    `/v1/shuttle-operation/admin/shuttles/${shuttleId}/dates/${dailyShuttleId}/routes/${routeId}/confirm`,
    {},
  );
  queryClient.invalidateQueries({
    queryKey: ['routes', shuttleId, dailyShuttleId],
  });
  return response;
};
