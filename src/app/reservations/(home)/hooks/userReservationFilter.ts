import { GetReservationOption } from '@/services/v2/reservations.services';
import { useReducer } from 'react';

const empty: GetReservationOption = {
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
      eventId: GetReservationOption['eventId'];
    }
  | {
      type: 'SET_DAILY_EVENT_ID';
      dailyEventId: GetReservationOption['dailyEventId'];
    }
  | {
      type: 'SET_SHUTTLE_ROUTE_ID';
      shuttleRouteId: GetReservationOption['shuttleRouteId'];
    }
  | {
      type: 'SET_SHUTTLE_BUS_ID';
      shuttleBusId: GetReservationOption['shuttleBusId'];
    }
  | {
      type: 'SET_USER_NICKNAME';
      userNickname: GetReservationOption['userNickname'];
    }
  | {
      type: 'SET_PASSENGER_NAME';
      passengerName: GetReservationOption['passengerName'];
    }
  | {
      type: 'SET_HANDY_STATUS';
      handyStatus: GetReservationOption['handyStatus'];
    }
  | {
      type: 'SET_RESERVATION_STATUS';
      reservationStatus: GetReservationOption['reservationStatus'];
    }
  | {
      type: 'SET_CANCEL_STATUS';
      cancelStatus: GetReservationOption['cancelStatus'];
    }
  | {
      type: 'RESET';
    };

const reducer = (
  prevState: GetReservationOption,
  action: ReservationFilterAction,
): GetReservationOption => {
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

const useReservationFilter = (partial: Partial<GetReservationOption> = {}) => {
  return useReducer(reducer, {
    ...empty,
    ...partial,
  });
};

export default useReservationFilter;
