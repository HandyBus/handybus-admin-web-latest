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

export const sendHandyPartyCancelled = async (reservationId: string) => {
  await authInstance.post(
    `/v1/shuttle-operation/admin/reservations/${reservationId}/send-handy-party-cancelled`,
  );
};

export const useSendHandyPartyCancelled = () => {
  return useMutation({
    mutationFn: ({ reservationId }: { reservationId: string }) =>
      sendHandyPartyCancelled(reservationId),
  });
};

export const sendHandyPartyConfirmed = async (reservationId: string) => {
  await authInstance.post(
    `/v1/shuttle-operation/admin/reservations/${reservationId}/send-handy-party-confirmed`,
  );
};

export const useSendHandyPartyConfirmed = () => {
  return useMutation({
    mutationFn: ({ reservationId }: { reservationId: string }) =>
      sendHandyPartyConfirmed(reservationId),
  });
};
