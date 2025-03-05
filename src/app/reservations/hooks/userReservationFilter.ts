import { GetReservationsOptions } from '@/services/reservation.service';
import { useReducer } from 'react';

const empty: GetReservationsOptions = {
  eventId: undefined,
  dailyEventId: undefined,
  shuttleRouteId: undefined,
  shuttleBusId: undefined,
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
  return useReducer(reducer, {
    ...empty,
    ...partial,
  });
};

export default useReservationFilter;
