import { useState, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FilterPeriod } from '../types/types';

export const useDateNavigation = () => {
  const [period, setPeriod] = useState<FilterPeriod>('전체');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  /*
   * 날짜 및 기간 로직:
   * 1. 전체: 시작일 2025-02-12
   * 2. 월간: 최근 6개월
   * 3. 주간: 최근 12주
   * 4. 일간: 최근 30일
   */
  const queryStartDate = useMemo(() => {
    if (startDate) return startDate.format('YYYY-MM-DD');

    const today = dayjs();
    switch (period) {
      case '전체':
        return '2025-02-12';
      case '월간':
        return today.subtract(5, 'month').startOf('month').format('YYYY-MM-DD');
      case '주간':
        return today
          .subtract(11, 'week')
          .startOf('isoWeek')
          .format('YYYY-MM-DD');
      case '일간':
        return today.subtract(29, 'day').format('YYYY-MM-DD');
      default:
        return '2025-02-12';
    }
  }, [period, startDate]);

  const queryEndDate = useMemo(() => {
    if (endDate) return endDate.format('YYYY-MM-DD');
    return dayjs().format('YYYY-MM-DD');
  }, [endDate]);

  /*
   * Previous Period Calculation
   */
  const { prevStartDate, prevEndDate } = useMemo(() => {
    if (!startDate && period === '전체')
      return { prevStartDate: '', prevEndDate: '' };

    const start = dayjs(queryStartDate);
    const end = dayjs(queryEndDate);
    const duration = end.diff(start, 'day') + 1;

    const prevEnd = start.subtract(1, 'day');
    const prevStart = prevEnd.subtract(duration - 1, 'day');

    return {
      prevStartDate: prevStart.format('YYYY-MM-DD'),
      prevEndDate: prevEnd.format('YYYY-MM-DD'),
    };
  }, [startDate, period, queryStartDate, queryEndDate]);

  const changePeriod = (p: FilterPeriod) => {
    setPeriod(p);
    const today = dayjs();
    if (p === '전체') {
      setStartDate(null);
      setEndDate(null);
    } else if (p === '월간') {
      setStartDate(today.subtract(5, 'month').startOf('month'));
      setEndDate(today);
    } else if (p === '주간') {
      setStartDate(today.subtract(11, 'week').startOf('isoWeek'));
      setEndDate(today);
    } else if (p === '일간') {
      setStartDate(today.subtract(29, 'day'));
      setEndDate(today);
    }
  };

  const navigatePrev = () => {
    // startDate, endDate가 null일 때(초기 상태 등)는 queryStartDate 등을 기준으로 셋팅이 필요할 수 있으나,
    // 현재 로직상 period 변경 시 이미 state가 set되거나 null임.
    // null 상태에서 이동하려면 현재 계산된 query date를 기준으로 이동해야 함.
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
    // startDate, endDate가 null인 경우 (초기 상태 혹은 전체 기간) - query date 기준
    // 전체 기간일 때는 어차피 AnalysisSectionHeader에서 비활성화 처리됨.
    const currentStart = startDate ? startDate : dayjs(queryStartDate);
    const currentEnd = endDate ? endDate : dayjs(queryEndDate);
    const today = dayjs().startOf('day');
    const duration = currentEnd.diff(currentStart, 'day') + 1;
    const nextEnd = currentEnd.add(duration, 'day');

    // 예측된 다음 종료일이 오늘보다 미래라면(오늘을 포함하지 않고 완전히 넘어간다면) 비활성화
    return nextEnd.isAfter(today, 'day');
  }, [startDate, endDate, queryStartDate, queryEndDate]);

  const isPrevDisabled = useMemo(() => {
    // startDate, endDate가 null인 경우 (초기 상태 혹은 전체 기간)
    // 전체 기간일 때는 어차피 AnalysisSectionHeader에서 비활성화 처리됨.
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
    prevStartDate,
    prevEndDate,
    isNextDisabled,
    isPrevDisabled,
    changePeriod,
    navigatePrev,
    navigateNext,
    updateDateRange,
  };
};
