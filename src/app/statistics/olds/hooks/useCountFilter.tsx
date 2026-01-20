import { useReducer } from 'react';

export interface CountFilterOptions {
  countType: '일일' | '누적';
  range: '1주' | '3달' | '1년';
}

const useCountFilter = (partial: CountFilterOptions = EMPTY_COUNT_FILTER) => {
  return useReducer(reducer, {
    ...EMPTY_COUNT_FILTER,
    ...partial,
  });
};

export default useCountFilter;

const EMPTY_COUNT_FILTER: CountFilterOptions = {
  countType: '일일',
  range: '1주',
};

export type CountFilterAction =
  | {
      type: 'SET_TYPE';
      countType: CountFilterOptions['countType'];
    }
  | {
      type: 'SET_RANGE';
      range: CountFilterOptions['range'];
    }
  | {
      type: 'RESET';
    };

const reducer = (
  prevState: CountFilterOptions,
  action: CountFilterAction,
): CountFilterOptions => {
  switch (action.type) {
    case 'SET_TYPE':
      return {
        ...prevState,
        countType: action.countType,
      };
    case 'SET_RANGE':
      return {
        ...prevState,
        range: action.range,
      };
    case 'RESET':
      return {
        ...EMPTY_COUNT_FILTER,
      };
    default:
      console.error('Unknown action type', action);
      return prevState;
  }
};

export const getInterval = (range: CountFilterOptions['range']) => {
  switch (range) {
    case '1주':
      return { intervalDays: 1, totalRangeDate: 7 };
    case '3달':
      return { intervalDays: 3, totalRangeDate: 90 };
    case '1년':
      return { intervalDays: 14, totalRangeDate: 378 };
    default:
      return { intervalDays: 1, totalRangeDate: 7 };
  }
};
