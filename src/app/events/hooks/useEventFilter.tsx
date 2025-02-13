import { Combinations } from '@/types/common.type';
import { EventStatus, EventType } from '@/types/event.type';
import { useReducer } from 'react';

export interface EventFilterOptions {
  eventName?: string;
  eventLocationName?: string;
  eventLocationAddress?: string;
  eventType?: EventType;
  status?: Combinations<EventStatus>;
}

const useEventFilter = (partial: EventFilterOptions = {}) => {
  return useReducer(reducer, {
    ...EMPTY_EVENT_FILTER,
    ...partial,
  });
};

export default useEventFilter;

const EMPTY_EVENT_FILTER: EventFilterOptions = {
  eventName: undefined,
  eventLocationName: undefined,
  eventLocationAddress: undefined,
  eventType: undefined,
  status: 'OPEN,CLOSED',
};

export type EventFilterAction =
  | {
      type: 'SET_EVENT_NAME';
      eventName: EventFilterOptions['eventName'];
    }
  | {
      type: 'SET_EVENT_LOCATION_NAME';
      eventLocationName: EventFilterOptions['eventLocationName'];
    }
  | {
      type: 'SET_EVENT_LOCATION_ADDRESS';
      eventLocationAddress: EventFilterOptions['eventLocationAddress'];
    }
  | {
      type: 'SET_EVENT_TYPE';
      eventType: EventFilterOptions['eventType'];
    }
  | {
      type: 'SET_STATUS';
      status: EventFilterOptions['status'];
    }
  | {
      type: 'RESET';
    };

const reducer = (
  prevState: EventFilterOptions,
  action: EventFilterAction,
): EventFilterOptions => {
  switch (action.type) {
    case 'SET_EVENT_NAME':
      return {
        ...prevState,
        eventName: action.eventName,
      };
    case 'SET_EVENT_LOCATION_NAME':
      return {
        ...prevState,
        eventLocationName: action.eventLocationName,
      };
    case 'SET_EVENT_LOCATION_ADDRESS':
      return {
        ...prevState,
        eventLocationAddress: action.eventLocationAddress,
      };
    case 'SET_EVENT_TYPE':
      return {
        ...prevState,
        eventType: action.eventType,
      };
    case 'SET_STATUS':
      const prevStatus = prevState.status ? prevState.status.split(',') : [];
      const status = action.status;
      const newStatus = status
        ? prevStatus?.includes(status)
          ? prevStatus.filter((s) => s !== status)
          : [...prevStatus, status]
        : undefined;

      return {
        ...prevState,
        status: newStatus?.join(',') as Combinations<EventStatus> | undefined,
      };
    case 'RESET':
      return {
        ...EMPTY_EVENT_FILTER,
      };
    default:
      console.error('Unknown action type', action);
      return prevState;
  }
};
