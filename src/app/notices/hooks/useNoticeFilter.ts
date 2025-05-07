import { useReducer } from 'react';

export interface NoticeFilterState {
  withDeleted?: boolean;
}

export type NoticeFilterAction = {
  type: 'SET_WITH_DELETED';
  withDeleted?: boolean;
};

const reducer = (
  state: NoticeFilterState,
  action: NoticeFilterAction,
): NoticeFilterState => {
  switch (action.type) {
    case 'SET_WITH_DELETED':
      return { ...state, withDeleted: action.withDeleted };
    // ...다른 액션
    default:
      return state;
  }
};

export const useNoticeFilter = (partial: NoticeFilterState = {}) => {
  return useReducer(reducer, {
    ...partial,
  });
};
