import {
  CreateEventRequest,
  CreateEventRequestSchema,
  EventStatus,
  EventsViewEntitySchema,
  EventType,
  EventWithStatisticsViewEntitySchema,
  UpdateEventRequest,
  UpdateEventRequestSchema,
} from '@/types/event.type';
import { RouteTreeOptions } from './demand.service';
import { Combinations, withPagination } from '@/types/common.type';
import {
  DEFAULT_CLUSTER_MIN_COUNT,
  DEFAULT_EPSILON,
  DEFAULT_MAX_DISTANCE,
  DEFAULT_MAX_NODES,
  DEFAULT_MIN_COUNT,
} from '@/constants/common';
import { authInstance } from './config';
import { toSearchParamString } from '@/utils/searchParam.util';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { silentParse } from '@/utils/parse.util';
import { z } from 'zod';

// ----- GET -----

export interface GetEventsOptions {
  eventName?: string;
  eventLocationName?: string;
  eventLocationAddress?: string;
  eventType?: EventType;
  eventIsPinned?: boolean;
  status?: Combinations<EventStatus>;
  orderBy?: 'eventName';
  additionalOrderOptions?: 'ASC' | 'DESC';
  page?: string;
  limit?: number;
}

export const getEvents = async (options?: GetEventsOptions) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events${toSearchParamString({ ...options }, '?')}`,
    {
      shape: withPagination({
        events: EventsViewEntitySchema.array(),
      }),
    },
  );
  return res.events;
};

// TODO 추후에 pagination으로 변경
export const useGetEvents = (options?: GetEventsOptions) => {
  return useQuery({
    queryKey: ['event', options],
    queryFn: () => getEvents(options),
  });
};

export const getEvent = async (eventId: string) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}`,
    {
      shape: {
        event: EventsViewEntitySchema,
      },
    },
  );
  return res.event;
};

export const useGetEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId),
  });
};

export interface GetEventsStatsOptions extends RouteTreeOptions {
  eventName?: string;
  eventLocationName?: string;
  eventLocationAddress?: string;
  eventType?: EventType;
  status?: Combinations<EventStatus>;
  orderBy?: 'eventName' | 'startDate' | 'endDate';
  additionalOrderOptions?: 'ASC' | 'DESC';
  page: string | undefined;
  limit: number;
}

export const getEventsStats = async ({
  clusterMinCount = DEFAULT_CLUSTER_MIN_COUNT,
  minCount = DEFAULT_MIN_COUNT,
  maxNodes = DEFAULT_MAX_NODES,
  maxDistance = DEFAULT_MAX_DISTANCE,
  epsilon = DEFAULT_EPSILON,
  ...props
}: Partial<GetEventsStatsOptions>) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events/all/stats${toSearchParamString(
      {
        clusterMinCount,
        minCount,
        maxNodes,
        maxDistance,
        epsilon,
        ...props,
      },
      '?',
    )}`,
    {
      shape: withPagination({
        events: EventWithStatisticsViewEntitySchema.array(),
      }),
    },
  );
  return res;
};

export const useGetEventsStatsWithPagination = (
  options?: Partial<GetEventsStatsOptions>,
) =>
  useInfiniteQuery({
    queryKey: ['event', 'stats', options],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getEventsStats({ ...options, page: pageParam }),
    initialPageParam: undefined,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    placeholderData: keepPreviousData,
  });

// ----- POST -----

export const postEvent = async (body: CreateEventRequest) => {
  const res = await authInstance.post(
    '/v2/shuttle-operation/admin/events',
    silentParse(CreateEventRequestSchema, body),
    {
      shape: {
        eventId: z.string(),
      },
    },
  );
  return res.eventId;
};

export const usePostEvent = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event'] });
      onSuccess?.();
    },
    onError,
  });
};

export const putEvent = async (eventId: string, body: UpdateEventRequest) => {
  await authInstance.put(
    `/v2/shuttle-operation/admin/events/${eventId}`,
    silentParse(UpdateEventRequestSchema, body),
  );
};

export const usePutEvent = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  return useMutation({
    mutationFn: ({
      eventId,
      body,
    }: {
      eventId: string;
      body: UpdateEventRequest;
    }) => putEvent(eventId, body),
    onSuccess,
    onError,
  });
};
