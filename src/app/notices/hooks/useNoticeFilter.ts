import { useReducer } from 'react';

export interface GetNoticesOptions {
  withDeleted?: boolean;
}

export type NoticeFilterAction = {
  type: 'SET_WITH_DELETED';
  withDeleted?: boolean;
};

const reducer = (
  state: GetNoticesOptions,
  action: NoticeFilterAction,
): GetNoticesOptions => {
  switch (action.type) {
    case 'SET_WITH_DELETED':
      return { ...state, withDeleted: action.withDeleted };
    // ...다른 액션
    default:
      return state;
  }
};

export const useNoticeFilter = (partial: GetNoticesOptions = {}) => {
  return useReducer(reducer, {
    ...partial,
  });
};
