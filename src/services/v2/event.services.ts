import { silentParse } from '@/utils/parse.util';
import { authInstance } from '../config';
import {
  CreateEventRequest,
  EventsView,
  EventsViewEntity,
} from '@/types/v2/event.type';
import { queryClient } from '@/components/Provider';
import { toSearchParamString } from '@/utils/searchParam.util';
import { z } from 'zod';

export const getAllEvents = async (status?: EventsView['eventStatus']) => {
  const response = await authInstance.get(
    `/v2/shuttle-operation/admin/events${toSearchParamString({ status }, '?')}`,
    {
      shape: { events: EventsViewEntity.array() },
    },
  );
  return response.events;
};

export const getEvent = async (eventId: number) => {
  const response = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}`,
    {
      shape: {
        event: EventsViewEntity,
      },
    },
  );
  return response.event;
};

export const postEvent = async (request: CreateEventRequest) => {
  const response = await authInstance.post(
    '/v2/shuttle-operation/admin/events',
    silentParse(CreateEventRequest, request),
    {
      shape: { eventId: z.number() },
    },
  );
  queryClient.invalidateQueries({ queryKey: ['events'] });
  return response;
};
