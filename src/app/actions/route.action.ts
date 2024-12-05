'use server';

import { CreateShuttleRouteRequestType } from '@/types/route.type';
import { instance } from '@/services/config';
import { AxiosError } from 'axios';

export const addRoute = async (
  shuttleID: number,
  dailyShuttleID: number,
  input: CreateShuttleRouteRequestType,
) => {
  try {
    console.log('input', JSON.stringify(input, null, 2));
    const response = await instance.post(
      `/shuttle-operation/admin/shuttles/${shuttleID}/dates/${dailyShuttleID}/routes`,
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
  shuttleID: string,
  dailyShuttleID: string,
) => {
  try {
    const response = await instance.get(
      `/shuttle-operation/shuttles/${shuttleID}/dates/${dailyShuttleID}/routes`,
    );
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      throw e.response.data;
    }
    throw e;
  }
};
