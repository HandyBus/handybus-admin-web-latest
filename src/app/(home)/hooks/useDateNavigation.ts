import { useState, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FilterPeriod } from '../types/types';
import {
  calculateDateRangeForPeriod,
  calculateNextDateRange,
  calculatePrevDateRange,
  calculateQueryEndDate,
  calculateQueryStartDate,
  isAllTimeRange,
  isNextDateDisabled,
  isPrevDateDisabled,
} from '../utils/dateNavigation.util';

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
    return calculateQueryStartDate(period, startDate);
  }, [period, startDate]);

  const queryEndDate = useMemo(() => {
    return calculateQueryEndDate(endDate);
  }, [endDate]);

  const changePeriod = (p: FilterPeriod) => {
    setPeriod(p);
    const { startDate: newStart, endDate: newEnd } =
      calculateDateRangeForPeriod(p);
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  const setAllTimeRange = () => {
    setStartDate(dayjs(SYSTEM_MIN_DATE));
    setEndDate(dayjs().subtract(1, 'day'));
  };

  const isAllTime = useMemo(() => {
    return isAllTimeRange(startDate, endDate, SYSTEM_MIN_DATE);
  }, [startDate, endDate, SYSTEM_MIN_DATE]);

  const navigatePrev = () => {
    const start = startDate ? startDate : dayjs(queryStartDate);
    const end = endDate ? endDate : dayjs(queryEndDate);

    const { startDate: newStart, endDate: newEnd } = calculatePrevDateRange(
      start,
      end,
    );
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  const navigateNext = () => {
    const start = startDate ? startDate : dayjs(queryStartDate);
    const end = endDate ? endDate : dayjs(queryEndDate);

    const { startDate: newStart, endDate: newEnd } = calculateNextDateRange(
      start,
      end,
    );
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  const updateDateRange = (start: Dayjs | null, end: Dayjs | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const isNextDisabled = useMemo(() => {
    const currentStart = startDate ? startDate : dayjs(queryStartDate);
    const currentEnd = endDate ? endDate : dayjs(queryEndDate);
    return isNextDateDisabled(currentStart, currentEnd);
  }, [startDate, endDate, queryStartDate, queryEndDate]);

  const isPrevDisabled = useMemo(() => {
    const currentStart = startDate ? startDate : dayjs(queryStartDate);
    const currentEnd = endDate ? endDate : dayjs(queryEndDate);

    return isPrevDateDisabled(currentStart, currentEnd, SYSTEM_MIN_DATE);
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
