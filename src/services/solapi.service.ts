import { useMutation } from '@tanstack/react-query';
import { authInstance } from './config';

export const sendDemandedShuttleRouteNotCreated = async (eventId: string) => {
  await authInstance.post(
    `/v1/shuttle-operation/admin/events/${eventId}/send-demanded-shuttle-route-not-created`,
  );
};

export const useSendDemandedShuttleRouteNotCreated = () => {
  return useMutation({
    mutationFn: ({ eventId }: { eventId: string }) =>
      sendDemandedShuttleRouteNotCreated(eventId),
  });
};

export const sendDemandedShuttleRouteDoneCreating = async (eventId: string) => {
  await authInstance.post(
    `/v1/shuttle-operation/admin/events/${eventId}/send-demanded-shuttle-route-done-creating`,
  );
};

export const useSendDemandedShuttleRouteDoneCreating = () => {
  return useMutation({
    mutationFn: ({ eventId }: { eventId: string }) =>
      sendDemandedShuttleRouteDoneCreating(eventId),
  });
};
