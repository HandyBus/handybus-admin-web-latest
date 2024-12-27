'use server';

import { instance } from '@/services/config';
import {
  ShuttleSchema,
  ShuttleListSchema,
  CreateShuttleRequestSchema,
  type CreateShuttleRequestType,
} from '@/types/shuttle.type';

import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

export const addShuttle = async (request: CreateShuttleRequestType) => {
  try {
    CreateShuttleRequestSchema.parse(request);
    console.log('request', JSON.stringify(request, null, 2));
    const response = await instance.post(
      '/shuttle-operation/admin/shuttles',
      request,
    );
    console.log(response.request);
    revalidatePath('/shuttles');
    return response.data;
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') {
      throw e;
    }
    if (e instanceof AxiosError && e.response) {
      throw e.response.data;
    }
    throw e;
  }
};

export const getAllShuttles = async () => {
  const response = await instance.get('/shuttle-operation/admin/shuttles');

  return ShuttleListSchema.parse(response.data.shuttleDetails);
};

export const getShuttle = async (shuttleId: number) => {
  try {
    const response = await instance.get(
      `/shuttle-operation/admin/shuttles/${shuttleId}`,
    );

    if (!response.data.ok) {
      throw response;
    }

    return ShuttleSchema.parse(response.data.shuttleDetail);
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') {
      throw e;
    }
    if (e instanceof AxiosError && e.response) {
      throw e.response.data;
    }
    throw e;
  }
};
