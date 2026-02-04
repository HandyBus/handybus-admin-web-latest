import { Combinations } from '@/types/common.type';
import { EventStatus, EventType } from '@/types/event.type';
import { useReducer, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export interface EventFilterOptions {
  eventName?: string;
  eventLocationName?: string;
  eventLocationAddress?: string;
  eventType?: EventType;
  status?: Combinations<EventStatus>;
}

const useEventFilter = (partial: EventFilterOptions = {}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitialStateFromURL = useCallback((): EventFilterOptions => {
    const urlState: EventFilterOptions = {};

    if (searchParams.has('eventName')) {
      urlState.eventName = searchParams.get('eventName') || undefined;
    }

    if (searchParams.has('eventLocationName')) {
      urlState.eventLocationName =
        searchParams.get('eventLocationName') || undefined;
    }

    if (searchParams.has('eventLocationAddress')) {
      urlState.eventLocationAddress =
        searchParams.get('eventLocationAddress') || undefined;
    }

    if (searchParams.has('eventType')) {
      urlState.eventType =
        (searchParams.get('eventType') as EventType) || undefined;
    }

    if (searchParams.has('status')) {
      urlState.status =
        (searchParams.get('status') as Combinations<EventStatus>) || undefined;
    }

    return {
      ...EMPTY_EVENT_FILTER,
      ...partial,
      ...urlState,
    };
  }, [searchParams, partial]);

  const [state, dispatch] = useReducer(reducer, getInitialStateFromURL());

  const updateURL = useCallback(
    (newState: EventFilterOptions) => {
      const params = new URLSearchParams();

      if (newState.eventName) {
        params.set('eventName', newState.eventName);
      }

      if (newState.eventLocationName) {
        params.set('eventLocationName', newState.eventLocationName);
      }

      if (newState.eventLocationAddress) {
        params.set('eventLocationAddress', newState.eventLocationAddress);
      }

      if (newState.eventType) {
        params.set('eventType', newState.eventType);
      }

      if (newState.status) {
        params.set('status', newState.status);
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

export default useEventFilter;

const EMPTY_EVENT_FILTER: EventFilterOptions = {
  eventName: undefined,
  eventLocationName: undefined,
  eventLocationAddress: undefined,
  eventType: undefined,
  status: 'OPEN,STAND_BY',
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
        status:
          newStatus && newStatus.length > 0
            ? (newStatus.join(',') as Combinations<EventStatus>)
            : undefined,
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
