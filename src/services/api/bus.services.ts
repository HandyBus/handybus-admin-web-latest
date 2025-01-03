'use client';

import { CreateBusRequestType } from '@/types/bus.type';
import { authInstance } from '../new-fetch';

export const addBus = async (
  shuttleId: number,
  dailyShuttleId: number,
  shuttleRouteId: number,
  input: CreateBusRequestType,
) => {
  return await authInstance.post(
    `/shuttle-operation/admin/shuttles/${shuttleId}/dates/${dailyShuttleId}/routes/${shuttleRouteId}/buses`,
    input,
  );
};
