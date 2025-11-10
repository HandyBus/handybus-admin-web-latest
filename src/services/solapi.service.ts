import { useMutation } from '@tanstack/react-query';
import { authInstance } from './config';

export const sendShuttleBusCancelled = async ({
  reservationIds,
  shuttleRouteId,
}: {
  reservationIds: string[];
  shuttleRouteId: string;
}) => {
  await authInstance.post(
    `/v1/shuttle-operation/admin/reservations/send-shuttle-bus-cancelled`,
    {
      reservationIds,
      shuttleRouteId,
    },
  );
};

export const useSendShuttleBusCancelled = () => {
  return useMutation({
    mutationFn: ({
      reservationIds,
      shuttleRouteId,
    }: {
      reservationIds: string[];
      shuttleRouteId: string;
    }) => sendShuttleBusCancelled({ reservationIds, shuttleRouteId }),
  });
};

export const sendShuttleBusConfirmed = async ({
  reservationIds,
  shuttleRouteId,
}: {
  reservationIds: string[];
  shuttleRouteId: string;
}) => {
  await authInstance.post(
    `/v1/shuttle-operation/admin/reservations/send-shuttle-bus-confirmed`,
    {
      reservationIds,
      shuttleRouteId,
    },
  );
};

export const useSendShuttleBusConfirmed = () => {
  return useMutation({
    mutationFn: ({
      reservationIds,
      shuttleRouteId,
    }: {
      reservationIds: string[];
      shuttleRouteId: string;
    }) => sendShuttleBusConfirmed({ reservationIds, shuttleRouteId }),
  });
};

export const sendHandyPartyCancelled = async ({
  reservationIds,
  shuttleRouteId,
}: {
  reservationIds: string[];
  shuttleRouteId: string;
}) => {
  await authInstance.post(
    `/v1/shuttle-operation/admin/reservations/send-handy-party-cancelled`,
    {
      reservationIds,
      shuttleRouteId,
    },
  );
};

export const useSendHandyPartyCancelled = () => {
  return useMutation({
    mutationFn: ({
      reservationIds,
      shuttleRouteId,
    }: {
      reservationIds: string[];
      shuttleRouteId: string;
    }) => sendHandyPartyCancelled({ reservationIds, shuttleRouteId }),
  });
};

export const sendHandyPartyConfirmed = async ({
  reservationIds,
  shuttleRouteId,
}: {
  reservationIds: string[];
  shuttleRouteId: string;
}) => {
  await authInstance.post(
    `/v1/shuttle-operation/admin/reservations/send-handy-party-confirmed`,
    {
      reservationIds,
      shuttleRouteId,
    },
  );
};

export const useSendHandyPartyConfirmed = () => {
  return useMutation({
    mutationFn: ({
      reservationIds,
      shuttleRouteId,
    }: {
      reservationIds: string[];
      shuttleRouteId: string;
    }) => sendHandyPartyConfirmed({ reservationIds, shuttleRouteId }),
  });
};
