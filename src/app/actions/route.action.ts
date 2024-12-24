'use server';

import { CreateShuttleRouteRequestType } from '@/types/route.type';
import { instance } from '@/services/config';
import { AxiosError } from 'axios';

export const addRoute = async (
  shuttleId: number,
  dailyShuttleId: number,
  input: CreateShuttleRouteRequestType,
) => {
  try {
    console.log('input', JSON.stringify(input, null, 2));
    const response = await instance.post(
      `/shuttle-operation/admin/shuttles/${shuttleId}/dates/${dailyShuttleId}/routes`,
      input,
    );
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      throw e.response.data;
    }
    throw e;
  }
};

export const getAllRoutes = async (
  shuttleId: string,
  dailyShuttleId: string,
) => {
  try {
    const response = await instance.get(
      `/shuttle-operation/admin/shuttles/${shuttleId}/dates/${dailyShuttleId}/routes`,
    );
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      throw e.response.data;
    }
    throw e;
  }
};
