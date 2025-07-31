import { GetReservationsOptions } from '@/services/reservation.service';
import { useReducer, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const empty: GetReservationsOptions = {
  eventId: undefined,
  dailyEventId: undefined,
  shuttleRouteId: undefined,
  shuttleBusId: undefined,
  userName: undefined,
  userNickname: undefined,
  passengerName: undefined,
  handyStatus: undefined,
  reservationStatus: undefined,
  cancelStatus: undefined,
};

export type ReservationFilterAction =
  | {
      type: 'SET_EVENT_ID';
      eventId: GetReservationsOptions['eventId'];
    }
  | {
      type: 'SET_DAILY_EVENT_ID';
      dailyEventId: GetReservationsOptions['dailyEventId'];
    }
  | {
      type: 'SET_SHUTTLE_ROUTE_ID';
      shuttleRouteId: GetReservationsOptions['shuttleRouteId'];
    }
  | {
      type: 'SET_SHUTTLE_BUS_ID';
      shuttleBusId: GetReservationsOptions['shuttleBusId'];
    }
  | {
      type: 'SET_USER_NAME';
      userName: GetReservationsOptions['userName'];
    }
  | {
      type: 'SET_USER_NICKNAME';
      userNickname: GetReservationsOptions['userNickname'];
    }
  | {
      type: 'SET_PASSENGER_NAME';
      passengerName: GetReservationsOptions['passengerName'];
    }
  | {
      type: 'SET_HANDY_STATUS';
      handyStatus: GetReservationsOptions['handyStatus'];
    }
  | {
      type: 'SET_RESERVATION_STATUS';
      reservationStatus: GetReservationsOptions['reservationStatus'];
    }
  | {
      type: 'SET_CANCEL_STATUS';
      cancelStatus: GetReservationsOptions['cancelStatus'];
    }
  | {
      type: 'RESET';
    };

const reducer = (
  prevState: GetReservationsOptions,
  action: ReservationFilterAction,
): GetReservationsOptions => {
  switch (action.type) {
    case 'SET_EVENT_ID':
      return {
        ...prevState,
        eventId: action.eventId,
        dailyEventId: undefined,
        shuttleRouteId: undefined,
        shuttleBusId: undefined,
      };
    case 'SET_DAILY_EVENT_ID':
      return {
        ...prevState,
        dailyEventId: action.dailyEventId,
        shuttleRouteId: undefined,
        shuttleBusId: undefined,
      };
    case 'SET_SHUTTLE_ROUTE_ID':
      return {
        ...prevState,
        shuttleRouteId: action.shuttleRouteId,
        shuttleBusId: undefined,
      };
    case 'SET_SHUTTLE_BUS_ID':
      return {
        ...prevState,
        shuttleBusId: action.shuttleBusId,
      };
    case 'SET_USER_NAME':
      return {
        ...prevState,
        userName: action.userName,
      };
    case 'SET_USER_NICKNAME':
      return {
        ...prevState,
        userNickname: action.userNickname,
      };
    case 'SET_PASSENGER_NAME':
      return {
        ...prevState,
        passengerName: action.passengerName,
      };
    case 'SET_HANDY_STATUS':
      return {
        ...prevState,
        handyStatus: action.handyStatus,
      };
    case 'SET_RESERVATION_STATUS':
      return {
        ...prevState,
        reservationStatus: action.reservationStatus,
      };
    case 'SET_CANCEL_STATUS':
      return {
        ...prevState,
        cancelStatus: action.cancelStatus,
      };
    case 'RESET':
      return {
        ...empty,
      };
    default:
      console.error('Unknown action type', action);
      return prevState;
  }
};

const useReservationFilter = (
  partial: Partial<GetReservationsOptions> = {},
) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitialStateFromURL = useCallback((): GetReservationsOptions => {
    const urlState: GetReservationsOptions = {
      ...empty,
    };

    if (searchParams.has('eventId')) {
      urlState.eventId = searchParams.get('eventId') || undefined;
    }

    if (searchParams.has('dailyEventId')) {
      urlState.dailyEventId = searchParams.get('dailyEventId') || undefined;
    }

    if (searchParams.has('shuttleRouteId')) {
      urlState.shuttleRouteId = searchParams.get('shuttleRouteId') || undefined;
    }

    if (searchParams.has('shuttleBusId')) {
      urlState.shuttleBusId = searchParams.get('shuttleBusId') || undefined;
    }

    if (searchParams.has('userNickname')) {
      urlState.userNickname = searchParams.get('userNickname') || undefined;
    }

    if (searchParams.has('userName')) {
      urlState.userName = searchParams.get('userName') || undefined;
    }

    if (searchParams.has('passengerName')) {
      urlState.passengerName = searchParams.get('passengerName') || undefined;
    }

    if (searchParams.has('handyStatus')) {
      urlState.handyStatus =
        (searchParams.get(
          'handyStatus',
        ) as GetReservationsOptions['handyStatus']) || undefined;
    }

    if (searchParams.has('reservationStatus')) {
      urlState.reservationStatus =
        (searchParams.get(
          'reservationStatus',
        ) as GetReservationsOptions['reservationStatus']) || undefined;
    }

    if (searchParams.has('cancelStatus')) {
      urlState.cancelStatus =
        (searchParams.get(
          'cancelStatus',
        ) as GetReservationsOptions['cancelStatus']) || undefined;
    }

    return {
      ...empty,
      ...partial,
      ...urlState,
    };
  }, [searchParams, partial]);

  const [state, dispatch] = useReducer(reducer, getInitialStateFromURL());

  const updateURL = useCallback(
    (newState: GetReservationsOptions) => {
      const params = new URLSearchParams();

      if (newState.eventId) {
        params.set('eventId', newState.eventId);
      }

      if (newState.dailyEventId) {
        params.set('dailyEventId', newState.dailyEventId);
      }

      if (newState.shuttleRouteId) {
        params.set('shuttleRouteId', newState.shuttleRouteId);
      }

      if (newState.shuttleBusId) {
        params.set('shuttleBusId', newState.shuttleBusId);
      }

      if (newState.userName) {
        params.set('userName', newState.userName);
      }

      if (newState.userNickname) {
        params.set('userNickname', newState.userNickname);
      }

      if (newState.passengerName) {
        params.set('passengerName', newState.passengerName);
      }

      if (newState.handyStatus) {
        params.set('handyStatus', newState.handyStatus);
      }

      if (newState.reservationStatus) {
        params.set('reservationStatus', newState.reservationStatus);
      }

      if (newState.cancelStatus) {
        params.set('cancelStatus', newState.cancelStatus);
      }

      const paramString = params.toString();
      const newURL = paramString ? `?${paramString}` : window.location.pathname;
      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    updateURL(state);
  }, [state, updateURL]);

  return [state, dispatch] as const;
};

export default useReservationFilter;
