import { useState, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FilterPeriod } from '../types/types';

export const useDateNavigation = () => {
  const [period, setPeriod] = useState<FilterPeriod>('일간');
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().subtract(29, 'day'),
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  /*
   * 날짜 및 기간 로직:
   * 1. 월간: 최근 6개월
   * 2. 주간: 최근 12주
   * 3. 일간: 최근 30일
   */
  const queryStartDate = useMemo(() => {
    if (startDate) return startDate.format('YYYY-MM-DD');

    const today = dayjs();
    switch (period) {
      case '월간':
        return today.subtract(5, 'month').startOf('month').format('YYYY-MM-DD');
      case '주간':
        return today
          .subtract(11, 'week')
          .startOf('isoWeek')
          .format('YYYY-MM-DD');
      // case '일간':
      default:
        return today.subtract(29, 'day').format('YYYY-MM-DD');
    }
  }, [period, startDate]);

  const queryEndDate = useMemo(() => {
    if (endDate) return endDate.format('YYYY-MM-DD');
    return dayjs().format('YYYY-MM-DD');
  }, [endDate]);

  const changePeriod = (p: FilterPeriod) => {
    setPeriod(p);
    const today = dayjs();

    // Default ranges when switching unit
    if (p === '월간') {
      setStartDate(today.subtract(5, 'month').startOf('month'));
      setEndDate(today);
    } else if (p === '주간') {
      setStartDate(today.subtract(11, 'week').startOf('isoWeek'));
      setEndDate(today);
    } else {
      // 일간
      setStartDate(today.subtract(29, 'day'));
      setEndDate(today);
    }
  };

  const setAllTimeRange = () => {
    setStartDate(dayjs('2025-02-12'));
    setEndDate(dayjs());
  };

  const isAllTime = useMemo(() => {
    if (!startDate || !endDate) return false;
    const allTimeStart = dayjs('2025-02-12');
    const today = dayjs();
    return (
      startDate.isSame(allTimeStart, 'day') && endDate.isSame(today, 'day')
    );
  }, [startDate, endDate]);

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
    const today = dayjs().startOf('day');
    const duration = currentEnd.diff(currentStart, 'day') + 1;
    const nextEnd = currentEnd.add(duration, 'day');

    // 예측된 다음 종료일이 오늘보다 미래라면(오늘을 포함하지 않고 완전히 넘어간다면) 비활성화
    return nextEnd.isAfter(today, 'day');
  }, [startDate, endDate, queryStartDate, queryEndDate]);

  const isPrevDisabled = useMemo(() => {
    const currentStart = startDate ? startDate : dayjs(queryStartDate);
    const currentEnd = endDate ? endDate : dayjs(queryEndDate);
    const duration = currentEnd.diff(currentStart, 'day') + 1;
    const prevStart = currentStart.subtract(duration, 'day');

    // 예측된 이전 시작일이 2025-02-12 이전이라면 비활성화
    return prevStart.isBefore('2025-02-12');
  }, [startDate, endDate, queryStartDate, queryEndDate]);

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
