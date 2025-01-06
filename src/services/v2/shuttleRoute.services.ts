'use client';

import { authInstance } from '../config';
import {
  ShuttleRoutesViewEntity,
  type ShuttleRoutesViewType,
} from '@/types/v2/shuttleRoute.type';

interface GetRouteFilter {
  status: ShuttleRoutesViewType['status'];
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
  const response = await authInstance.get<{
    shuttleRoutes: unknown;
  }>(
    `/v1/shuttle-operation/admin/shuttles/${shuttleId}/dates/${dailyShuttleId}/routes?${new URLSearchParams(filter)}`,
  );
  return ShuttleRoutesViewEntity.array().parse(response.shuttleRoutes);
};
