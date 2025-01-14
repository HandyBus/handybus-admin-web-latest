import { silentParse } from '@/utils/parse.util';
import { authInstance } from '../config';
import {
  CreateEventRequest,
  EventsView,
  EventsViewEntity,
} from '@/types/v2/event.type';
import { queryClient } from '@/components/Provider';
import { toSearchParamString } from '@/utils/searchParam.util';

export const readAllEvents = async (status?: EventsView['eventStatus']) => {
  const response = await authInstance.get(
    `/v2/shuttle-operation/admin/events${toSearchParamString({ status }, '?')}`,
    {
      shape: { events: EventsViewEntity.array() },
    },
  );
  return response.events;
};

export const readEvent = async (eventId: number) => {
  const response = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}`,
    {
      shape: {
        // TODO check is this api use EventsViewEntity ?
        // 문서에는 따로 명시되어 있지 않으나 일단 호환됨
        event: EventsViewEntity,
      },
    },
  );
  return response.event;
};

export const createEvent = async (request: CreateEventRequest) => {
  const response = await authInstance.post(
    '/v2/shuttle-operation/admin/events',
    silentParse(CreateEventRequest, request),
  );
  queryClient.invalidateQueries({ queryKey: ['events'] });
  return response;
};
