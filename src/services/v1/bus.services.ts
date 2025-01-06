'use client';

import { CreateBusRequestType } from '@/types/v1/bus.type';
import { authInstance } from '../config';

export const addBus = async (
  shuttleId: number,
  dailyShuttleId: number,
  shuttleRouteId: number,
  input: CreateBusRequestType,
) => {
  return await authInstance.post(
    `/v1/shuttle-operation/admin/shuttles/${shuttleId}/dates/${dailyShuttleId}/routes/${shuttleRouteId}/buses`,
    input,
  );
};
