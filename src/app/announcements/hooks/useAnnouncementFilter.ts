import { useReducer } from 'react';

export interface AnnouncementFilterState {
  withDeleted?: boolean;
}

export type AnnouncementFilterAction = {
  type: 'SET_WITH_DELETED';
  withDeleted?: boolean;
};

const reducer = (
  state: AnnouncementFilterState,
  action: AnnouncementFilterAction,
): AnnouncementFilterState => {
  switch (action.type) {
    case 'SET_WITH_DELETED':
      return { ...state, withDeleted: action.withDeleted };
    // ...다른 액션
    default:
      return state;
  }
};

export const useAnnouncementFilter = (
  partial: AnnouncementFilterState = {},
) => {
  return useReducer(reducer, {
    ...partial,
  });
};
