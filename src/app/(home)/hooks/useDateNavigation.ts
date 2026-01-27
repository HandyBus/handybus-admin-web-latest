import { useState, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FilterPeriod } from '../types/types';

interface UseDateNavigationConfig {
  minDate?: string;
}

export const useDateNavigation = (config?: UseDateNavigationConfig) => {
  // 기본값: '2025-02-12' (다른 컴포넌트들을 위한 기본값)
  const SYSTEM_MIN_DATE = config?.minDate || '2025-02-12';

  const [period, setPeriod] = useState<FilterPeriod>('일간');
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().subtract(1, 'day').subtract(29, 'day'),
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    dayjs().subtract(1, 'day'),
  );

  /*
   * 날짜 및 기간 로직:
   * 1. 월간: 최근 6개월
   * 2. 주간: 최근 12주
   * 3. 일간: 최근 30일
   */
  const queryStartDate = useMemo(() => {
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
  }, [period, startDate]);

  const queryEndDate = useMemo(() => {
    if (endDate) return endDate.format('YYYY-MM-DD');
    return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  }, [endDate]);

  const changePeriod = (p: FilterPeriod) => {
    setPeriod(p);
    const yesterday = dayjs().subtract(1, 'day');

    // Default ranges when switching unit
    if (p === '월간') {
      setStartDate(yesterday.subtract(5, 'month').startOf('month'));
      setEndDate(yesterday);
    } else if (p === '주간') {
      setStartDate(yesterday.subtract(11, 'week').startOf('isoWeek'));
      setEndDate(yesterday);
    } else {
      // 일간
      setStartDate(yesterday.subtract(29, 'day'));
      setEndDate(yesterday);
    }
  };

  const setAllTimeRange = () => {
    setStartDate(dayjs(SYSTEM_MIN_DATE));
    setEndDate(dayjs().subtract(1, 'day'));
  };

  const isAllTime = useMemo(() => {
    if (!startDate || !endDate) return false;
    const allTimeStart = dayjs(SYSTEM_MIN_DATE);
    const yesterday = dayjs().subtract(1, 'day');
    return (
      startDate.isSame(allTimeStart, 'day') && endDate.isSame(yesterday, 'day')
    );
  }, [startDate, endDate, SYSTEM_MIN_DATE]);

  const navigatePrev = () => {
    const start = startDate ? startDate : dayjs(queryStartDate);
    const end = endDate ? endDate : dayjs(queryEndDate);

    const diff = end.diff(start, 'day') + 1;
    setStartDate(start.subtract(diff, 'day'));
    setEndDate(end.subtract(diff, 'day'));
  };

  const navigateNext = () => {
    const start = startDate ? startDate : dayjs(queryStartDate);
    const end = endDate ? endDate : dayjs(queryEndDate);

    const diff = end.diff(start, 'day') + 1;
    setStartDate(start.add(diff, 'day'));
    setEndDate(end.add(diff, 'day'));
  };

  const updateDateRange = (start: Dayjs | null, end: Dayjs | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const isNextDisabled = useMemo(() => {
    const currentStart = startDate ? startDate : dayjs(queryStartDate);
    const currentEnd = endDate ? endDate : dayjs(queryEndDate);
    const yesterday = dayjs().subtract(1, 'day').startOf('day');
    const duration = currentEnd.diff(currentStart, 'day') + 1;
    const nextEnd = currentEnd.add(duration, 'day');

    // 예측된 다음 종료일이 어제보다 미래라면 비활성화
    return nextEnd.isAfter(yesterday, 'day');
  }, [startDate, endDate, queryStartDate, queryEndDate]);

  const isPrevDisabled = useMemo(() => {
    const currentStart = startDate ? startDate : dayjs(queryStartDate);
    const currentEnd = endDate ? endDate : dayjs(queryEndDate);
    const duration = currentEnd.diff(currentStart, 'day') + 1;
    const prevStart = currentStart.subtract(duration, 'day');

    // 예측된 이전 시작일이 시스템 최소 날짜 이전이라면 비활성화
    return prevStart.isBefore(SYSTEM_MIN_DATE);
  }, [startDate, endDate, queryStartDate, queryEndDate, SYSTEM_MIN_DATE]);

  return {
    period,
    startDate,
    endDate,
    queryStartDate,
    queryEndDate,
    isNextDisabled,
    isPrevDisabled,
    isAllTime,
    changePeriod,
    navigatePrev,
    navigateNext,
    updateDateRange,
    setAllTimeRange,
  };
};
