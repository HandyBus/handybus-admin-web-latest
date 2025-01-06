'use client';

import { authInstance } from '../config';
import { ShuttleEventsViewEntity } from '@/types/v2/shuttleEvent.type';

export const getAllShuttles = async () => {
  const response = await authInstance.get<{
    shuttleEvents: unknown;
  }>('/v2/shuttle-operation/admin/shuttles');
  return ShuttleEventsViewEntity.array().parse(response.shuttleEvents);
};
