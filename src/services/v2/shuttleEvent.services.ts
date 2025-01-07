'use client';

import { authInstance } from '../config';
import { EventsViewEntity } from '@/types/v2/event.type';
import { silentParse } from '@/utils/parse.util';

export const getAllShuttles = async () => {
  const response = await authInstance.get<{
    events: unknown;
  }>('/v2/shuttle-operation/admin/events');
  return silentParse(EventsViewEntity.array(), response.events);
};
