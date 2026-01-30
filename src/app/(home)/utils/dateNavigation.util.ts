import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { FilterPeriod } from '../types/types';

dayjs.extend(isoWeek);

export const getLatestDataDate = (): Dayjs => {
  const now = dayjs();
  // 오전 07:00 업데이트 기준
  // 현재 시간이 7시 이전이면, 최신 데이터는 그저께(2일 전) 기준
  // 현재 시간이 7시 이후이면, 최신 데이터는 어제(1일 전) 기준
  if (now.hour() < 7) {
    return now.subtract(2, 'day').startOf('day');
  }
  return now.subtract(1, 'day').startOf('day');
};

export const calculateQueryStartDate = (
  period: FilterPeriod,
  startDate: Dayjs | null,
): string => {
  if (startDate) return startDate.format('YYYY-MM-DD');

  const latestDate = getLatestDataDate();
  switch (period) {
    case '월간':
      return latestDate
        .subtract(5, 'month')
        .startOf('month')
        .format('YYYY-MM-DD');
    case '주간':
      return latestDate
        .subtract(11, 'week')
        .startOf('isoWeek')
        .format('YYYY-MM-DD');
    // case '일간':
    default:
      return latestDate.subtract(29, 'day').format('YYYY-MM-DD');
  }
};

export const calculateQueryEndDate = (endDate: Dayjs | null): string => {
  if (endDate) return endDate.format('YYYY-MM-DD');
  return getLatestDataDate().format('YYYY-MM-DD');
};

export const calculateDateRangeForPeriod = (period: FilterPeriod) => {
  const latestDate = getLatestDataDate();
  let startDate: Dayjs;
  const endDate = latestDate;

  if (period === '월간') {
    startDate = latestDate.subtract(5, 'month').startOf('month');
  } else if (period === '주간') {
    startDate = latestDate.subtract(11, 'week').startOf('isoWeek');
  } else {
    // 일간
    startDate = latestDate.subtract(29, 'day');
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
  const latestDate = getLatestDataDate().startOf('day');
  const duration = endDate.diff(startDate, 'day') + 1;
  const nextEnd = endDate.add(duration, 'day');

  // 예측된 다음 종료일이 최신 데이터 날짜보다 미래라면 비활성화
  return nextEnd.isAfter(latestDate, 'day');
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
  const latestDate = getLatestDataDate();
  return (
    startDate.isSame(allTimeStart, 'day') && endDate.isSame(latestDate, 'day')
  );
};
