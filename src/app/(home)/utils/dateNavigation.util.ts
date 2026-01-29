import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { FilterPeriod } from '../types/types';

dayjs.extend(isoWeek);

export const calculateQueryStartDate = (
  period: FilterPeriod,
  startDate: Dayjs | null,
): string => {
  if (startDate) return startDate.format('YYYY-MM-DD');

  const yesterday = dayjs().subtract(1, 'day');
  switch (period) {
    case '월간':
      return yesterday
        .subtract(5, 'month')
        .startOf('month')
        .format('YYYY-MM-DD');
    case '주간':
      return yesterday
        .subtract(11, 'week')
        .startOf('isoWeek')
        .format('YYYY-MM-DD');
    // case '일간':
    default:
      return yesterday.subtract(29, 'day').format('YYYY-MM-DD');
  }
};

export const calculateQueryEndDate = (endDate: Dayjs | null): string => {
  if (endDate) return endDate.format('YYYY-MM-DD');
  return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
};

export const calculateDateRangeForPeriod = (period: FilterPeriod) => {
  const yesterday = dayjs().subtract(1, 'day');
  let startDate: Dayjs;
  const endDate = yesterday;

  if (period === '월간') {
    startDate = yesterday.subtract(5, 'month').startOf('month');
  } else if (period === '주간') {
    startDate = yesterday.subtract(11, 'week').startOf('isoWeek');
  } else {
    // 일간
    startDate = yesterday.subtract(29, 'day');
  }
  return { startDate, endDate };
};

export const calculateNextDateRange = (startDate: Dayjs, endDate: Dayjs) => {
  const diff = endDate.diff(startDate, 'day') + 1;
  return {
    startDate: startDate.add(diff, 'day'),
    endDate: endDate.add(diff, 'day'),
  };
};

export const calculatePrevDateRange = (startDate: Dayjs, endDate: Dayjs) => {
  const diff = endDate.diff(startDate, 'day') + 1;
  return {
    startDate: startDate.subtract(diff, 'day'),
    endDate: endDate.subtract(diff, 'day'),
  };
};

export const isNextDateDisabled = (startDate: Dayjs, endDate: Dayjs) => {
  const yesterday = dayjs().subtract(1, 'day').startOf('day');
  const duration = endDate.diff(startDate, 'day') + 1;
  const nextEnd = endDate.add(duration, 'day');

  // 예측된 다음 종료일이 어제보다 미래라면 비활성화
  return nextEnd.isAfter(yesterday, 'day');
};

export const isPrevDateDisabled = (
  startDate: Dayjs,
  endDate: Dayjs,
  minDate: string,
) => {
  const duration = endDate.diff(startDate, 'day') + 1;
  const prevStart = startDate.subtract(duration, 'day');

  // 예측된 이전 시작일이 시스템 최소 날짜 이전이라면 비활성화
  return prevStart.isBefore(minDate);
};

export const isAllTimeRange = (
  startDate: Dayjs | null,
  endDate: Dayjs | null,
  minDate: string,
) => {
  if (!startDate || !endDate) return false;
  const allTimeStart = dayjs(minDate);
  const yesterday = dayjs().subtract(1, 'day');
  return (
    startDate.isSame(allTimeStart, 'day') && endDate.isSame(yesterday, 'day')
  );
};
