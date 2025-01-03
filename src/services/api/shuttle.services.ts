'use client';

import { queryClient } from '@/components/Provider';
import { authInstance } from '../new-fetch';
import {
  ShuttleWithDemandSchema,
  CreateShuttleRequestSchema,
  type CreateShuttleRequestType,
} from '@/types/shuttle.type';

export const addShuttle = async (request: CreateShuttleRequestType) => {
  const response = await authInstance.post<{
    ok: boolean;
  }>(
    '/shuttle-operation/admin/shuttles',
    CreateShuttleRequestSchema.parse(request),
  );
  queryClient.invalidateQueries({ queryKey: ['shuttles'] });
  return response;
};

export const getAllShuttles = async () => {
  const response = await authInstance.get<{
    ok: boolean;
    shuttleDetails: unknown;
  }>('/shuttle-operation/admin/shuttles');
  return ShuttleWithDemandSchema.array().parse(response.shuttleDetails);
};

export const getShuttle = async (shuttleId: number) => {
  const response = await authInstance.get<{
    ok: boolean;
    shuttleDetail: unknown;
  }>(`/shuttle-operation/admin/shuttles/${shuttleId}`);
  return ShuttleWithDemandSchema.parse(response.shuttleDetail);
};