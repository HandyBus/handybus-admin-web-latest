'use server';

import { instance } from '@/services/config';
import { CreateBusRequestType } from '@/types/bus.type';
import { revalidatePath } from 'next/cache';

export const addBus = async (
  shuttleId: number,
  dailyShuttleId: number,
  shuttleRouteId: number,
  input: CreateBusRequestType,
) => {
  const ret = (
    await instance.post(
      `/shuttle-operation/admin/shuttles/${shuttleId}/dates/${dailyShuttleId}/routes/${shuttleRouteId}/buses`,
      input,
    )
  ).data;
  revalidatePath(
    `/shuttles/${shuttleId}/dates/${dailyShuttleId}/routes/${shuttleRouteId}`,
    'layout',
  );
  console.log('addBus', ret);
  return ret;
};
