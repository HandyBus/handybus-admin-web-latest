import { useMutation } from '@tanstack/react-query';
import { authInstance } from './config';

export const sendShuttleInformation = async (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
) => {
  await authInstance.post(
    `/v1/shuttle-operation/admin/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/send-shuttle-information`,
  );
};

export const useSendShuttleInformation = () => {
  return useMutation({
    mutationFn: ({
      eventId,
      dailyEventId,
      shuttleRouteId,
    }: {
      eventId: string;
      dailyEventId: string;
      shuttleRouteId: string;
    }) => sendShuttleInformation(eventId, dailyEventId, shuttleRouteId),
  });
};

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
