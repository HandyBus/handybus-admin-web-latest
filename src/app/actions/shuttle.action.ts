'use server';

import { instance } from '@/services/config';
import {
  ShuttleSchema,
  CreateShuttleRequestSchema,
  type CreateShuttleRequestType,
} from '@/types/shuttle.type';

import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

export const addShuttle = async (request: CreateShuttleRequestType) => {
  try {
    CreateShuttleRequestSchema.parse(request);
    console.log('request', JSON.stringify(request, null, 2));
    const response = (
      await instance.post('/shuttle-operation/admin/shuttles', request)
    ).data;
    revalidatePath('/shuttles');
    return response;
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

export const getShuttle = async (shuttleID: number) => {
  try {
    const response = await instance.get(
      `/shuttle-operation/shuttles/${shuttleID}`,
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
