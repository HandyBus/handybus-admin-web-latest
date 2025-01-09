'use client';

import { authInstance } from '../config';
import { EventsViewEntity } from '@/types/v2/event.type';

export const getAllShuttles = async () => {
  const response = await authInstance.get(
    '/v2/shuttle-operation/admin/events',
    {
      shape: { events: EventsViewEntity.array() },
    },
  );
  return response.events;
};
