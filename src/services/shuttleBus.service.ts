import {
  CreateShuttleBusRequestSchema,
  CreateShuttleBusRequest,
  ShuttleBusesViewEntitySchema,
  AdminUpdateShuttleBusRequest,
  AdminUpdateShuttleBusRequestSchema,
  BulkAssignBusRequestSchema,
  BulkAssignBusRequest,
} from '@/types/shuttleBus.type';
import { authInstance } from './config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { silentParse } from '@/utils/parse.util';

// ----- GET -----

export const getShuttleBuses = async (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses`,
    {
      shape: {
        shuttleBuses: ShuttleBusesViewEntitySchema.array(),
      },
    },
  );
  return res.shuttleBuses;
};

export const useGetShuttleBuses = (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
) => {
  return useQuery({
    queryKey: ['shuttleBus', eventId, dailyEventId, shuttleRouteId],
    queryFn: () => getShuttleBuses(eventId, dailyEventId, shuttleRouteId),
  });
};

export const getShuttleBus = async (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
  shuttleBusId: string,
) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses/${shuttleBusId}`,
    {
      shape: {
        shuttleBus: ShuttleBusesViewEntitySchema,
      },
    },
  );
  return res.shuttleBus;
};

export const useGetShuttleBus = (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
  shuttleBusId: string,
) => {
  return useQuery({
    queryKey: [
      'shuttleBus',
      eventId,
      dailyEventId,
      shuttleRouteId,
      shuttleBusId,
    ],
    queryFn: () =>
      getShuttleBus(eventId, dailyEventId, shuttleRouteId, shuttleBusId),
  });
};

// ----- POST -----

export const postShuttleBus = async (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
  body: CreateShuttleBusRequest,
) => {
  await authInstance.post(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses`,
    silentParse(CreateShuttleBusRequestSchema, body),
  );
};

export const usePostShuttleBus = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  return useMutation({
    mutationFn: ({
      eventId,
      dailyEventId,
      shuttleRouteId,
      body,
    }: {
      eventId: string;
      dailyEventId: string;
      shuttleRouteId: string;
      body: CreateShuttleBusRequest;
    }) => postShuttleBus(eventId, dailyEventId, shuttleRouteId, body),
    onSuccess,
    onError,
  });
};

export const putShuttleBus = async (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
  shuttleBusId: string,
  body: AdminUpdateShuttleBusRequest,
) => {
  await authInstance.put(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses/${shuttleBusId}`,
    silentParse(AdminUpdateShuttleBusRequestSchema, body),
  );
};

export const usePutShuttleBus = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: ({
      eventId,
      dailyEventId,
      shuttleRouteId,
      shuttleBusId,
      body,
    }: {
      eventId: string;
      dailyEventId: string;
      shuttleRouteId: string;
      shuttleBusId: string;
      body: AdminUpdateShuttleBusRequest;
    }) =>
      putShuttleBus(eventId, dailyEventId, shuttleRouteId, shuttleBusId, body),
    onSuccess,
    onError,
  });
};

export const postBulkAssignBus = async (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
  body: BulkAssignBusRequest,
) => {
  return await authInstance.post(
    `/v2/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses/bulk-assign`,
    silentParse(BulkAssignBusRequestSchema, body),
  );
};

export const usePostBulkAssignBus = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      dailyEventId,
      shuttleRouteId,
      body,
    }: {
      eventId: string;
      dailyEventId: string;
      shuttleRouteId: string;
      body: BulkAssignBusRequest;
    }) => postBulkAssignBus(eventId, dailyEventId, shuttleRouteId, body),
    onSuccess: (_, { eventId, dailyEventId, shuttleRouteId }) => {
      queryClient.invalidateQueries({
        queryKey: ['reservation', eventId, dailyEventId, shuttleRouteId],
      });
      onSuccess?.();
    },
    onError,
  });
};
