'use client';

import { queryClient } from '@/components/Provider';
import { authInstance } from '../config';
import {
  ShuttleWithDemandSchema,
  CreateShuttleRequestSchema,
  type CreateShuttleRequestType,
} from '@/types/v1/shuttle.type';
import { silentParse } from '@/utils/parse.util';

export const addShuttle = async (request: CreateShuttleRequestType) => {
  const response = await authInstance.post<{
    ok: boolean;
  }>(
    '/v1/shuttle-operation/admin/shuttles',
    silentParse(CreateShuttleRequestSchema, request),
  );
  queryClient.invalidateQueries({ queryKey: ['shuttles'] });
  return response;
};

export const getShuttle = async (shuttleId: number) => {
  const response = await authInstance.get<{
    ok: boolean;
    shuttleDetail: unknown;
  }>(`/v1/shuttle-operation/admin/shuttles/${shuttleId}`);
  return silentParse(ShuttleWithDemandSchema, response.shuttleDetail);
};
