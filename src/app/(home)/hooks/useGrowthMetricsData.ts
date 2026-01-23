import { useMemo } from 'react';
import {
  getDailyGmvMetrics,
  getDailySignupMetrics,
  getDailyExploreMetrics,
  getWeeklyExploreMetrics,
  getMonthlyExploreMetrics,
  getDailyCoreMetrics,
  getWeeklyCoreMetrics,
  getMonthlyCoreMetrics,
} from '@/services/analytics.service';
import {
  DailyCoreMetricsViewEntity,
  DailyExploreMetricsViewEntity,
  DailyGmvMetricsViewEntity,
  DailySignupMetricsViewEntity,
  MonthlyCoreMetricsViewEntity,
  MonthlyExploreMetricsViewEntity,
  WeeklyCoreMetricsViewEntity,
  WeeklyExploreMetricsViewEntity,
} from '@/types/analytics.type';
import { useComparisonQuery } from '@/app/(home)/hooks/useComparisonQuery';
import { MetricData, FilterPeriod } from '@/app/(home)/types/types';
import { processChartData } from '@/app/(home)/utils/chartData.util';

interface UseGrowthMetricsDataProps {
  currentStartDate: string;
  currentEndDate: string;
  prevStartDate: string;
  prevEndDate: string;
  period: FilterPeriod;
}

export const useGrowthMetricsData = ({
  currentStartDate,
  currentEndDate,
  prevStartDate,
  prevEndDate,
  period,
}: UseGrowthMetricsDataProps) => {
  const { currentData: gmvData, prevData: prevGmvData } = useComparisonQuery({
    queryKey: ['daily-gmv-metrics'],
    fetcher: getDailyGmvMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate,
    prevEndDate,
    enabled: true,
  });

  const { currentData: signupData, prevData: prevSignupData } =
    useComparisonQuery({
      queryKey: ['daily-signup-metrics'],
      fetcher: getDailySignupMetrics,
      currentStartDate,
      currentEndDate,
      prevStartDate,
      prevEndDate,
      enabled: true,
    });

  // Active Users Explore
  const { currentData: dailyExploreData, prevData: prevDailyExploreData } =
    useComparisonQuery({
      queryKey: ['daily-explore-metrics'],
      fetcher: getDailyExploreMetrics,
      currentStartDate,
      currentEndDate,
      prevStartDate,
      prevEndDate,
      enabled: period === '일간',
    });
  const { currentData: weeklyExploreData, prevData: prevWeeklyExploreData } =
    useComparisonQuery({
      queryKey: ['weekly-explore-metrics'],
      fetcher: getWeeklyExploreMetrics,
      currentStartDate,
      currentEndDate,
      prevStartDate,
      prevEndDate,
      enabled: period === '주간',
    });
  const { currentData: monthlyExploreData, prevData: prevMonthlyExploreData } =
    useComparisonQuery({
      queryKey: ['monthly-explore-metrics'],
      fetcher: getMonthlyExploreMetrics,
      currentStartDate,
      currentEndDate,
      prevStartDate,
      prevEndDate,
      enabled: period !== '일간' && period !== '주간',
    });

  // Active Users Core
  const { currentData: dailyCoreData, prevData: prevDailyCoreData } =
    useComparisonQuery({
      queryKey: ['daily-core-metrics'],
      fetcher: getDailyCoreMetrics,
      currentStartDate,
      currentEndDate,
      prevStartDate,
      prevEndDate,
      enabled: period === '일간',
    });
  const { currentData: weeklyCoreData, prevData: prevWeeklyCoreData } =
    useComparisonQuery({
      queryKey: ['weekly-core-metrics'],
      fetcher: getWeeklyCoreMetrics,
      currentStartDate,
      currentEndDate,
      prevStartDate,
      prevEndDate,
      enabled: period === '주간',
    });
  const { currentData: monthlyCoreData, prevData: prevMonthlyCoreData } =
    useComparisonQuery({
      queryKey: ['monthly-core-metrics'],
      fetcher: getMonthlyCoreMetrics,
      currentStartDate,
      currentEndDate,
      prevStartDate,
      prevEndDate,
      enabled: period !== '일간' && period !== '주간',
    });

  // 기간에 따른 Active Users 데이터 선택
  const exploreData = useMemo(() => {
    if (period === '일간') return dailyExploreData;
    if (period === '주간') return weeklyExploreData;
    return monthlyExploreData;
  }, [period, dailyExploreData, weeklyExploreData, monthlyExploreData]);

  const prevExploreData = useMemo(() => {
    if (period === '일간') return prevDailyExploreData;
    if (period === '주간') return prevWeeklyExploreData;
    return prevMonthlyExploreData;
  }, [
    period,
    prevDailyExploreData,
    prevWeeklyExploreData,
    prevMonthlyExploreData,
  ]);

  const coreData = useMemo(() => {
    if (period === '일간') return dailyCoreData;
    if (period === '주간') return weeklyCoreData;
    return monthlyCoreData;
  }, [period, dailyCoreData, weeklyCoreData, monthlyCoreData]);

  const prevCoreData = useMemo(() => {
    if (period === '일간') return prevDailyCoreData;
    if (period === '주간') return prevWeeklyCoreData;
    return prevMonthlyCoreData;
  }, [period, prevDailyCoreData, prevWeeklyCoreData, prevMonthlyCoreData]);

  // 기간 라벨 접두사 생성
  const getPeriodLabelPrefix = (currentPeriod: FilterPeriod): string => {
    if (currentPeriod === '일간') return 'DAU';
    if (currentPeriod === '주간') return 'WAU';
    return 'MAU';
  };

  const calculatePercentage = (current: number, prev: number) => {
    if (period === '전체') return '-';
    if (!prev || prev === 0) return current > 0 ? '100%' : '-';
    const percent = ((current - prev) / prev) * 100;
    return percent.toFixed(1) + '%';
  };

  const processedMetrics: MetricData[] = useMemo(() => {
    const metrics: MetricData[] = [];
    const periodPrefix = getPeriodLabelPrefix(period);

    // 활성 사용자 (Explore)
    const exploreRawData = exploreData?.map(
      (
        d:
          | DailyExploreMetricsViewEntity
          | WeeklyExploreMetricsViewEntity
          | MonthlyExploreMetricsViewEntity,
      ) => {
        let dateField: string;
        if ('date' in d) dateField = d.date;
        else if ('week' in d) dateField = d.week;
        else dateField = d.month;
        return {
          date: dateField,
          value: d.pageReachUserCount,
        };
      },
    );
    const exploreChartData = processChartData(exploreRawData, period);
    const totalExploreUsers =
      exploreData?.reduce(
        (
          acc: number,
          curr:
            | DailyExploreMetricsViewEntity
            | WeeklyExploreMetricsViewEntity
            | MonthlyExploreMetricsViewEntity,
        ) => acc + curr.pageReachUserCount,
        0,
      ) || 0;
    const prevTotalExploreUsers =
      prevExploreData?.reduce(
        (
          acc: number,
          curr:
            | DailyExploreMetricsViewEntity
            | WeeklyExploreMetricsViewEntity
            | MonthlyExploreMetricsViewEntity,
        ) => acc + curr.pageReachUserCount,
        0,
      ) || 0;

    metrics.push({
      id: 'activeUsersExplore',
      title: 'Active Users',
      subtitle: 'Explore',
      value: totalExploreUsers.toLocaleString(),
      unit: '명',
      percentage: calculatePercentage(totalExploreUsers, prevTotalExploreUsers),
      chartData: exploreChartData,
      chartLabel: `${periodPrefix} (Explore)`,
    });

    // 활성 사용자 (Core)
    const coreRawData = coreData?.map(
      (
        d:
          | DailyCoreMetricsViewEntity
          | WeeklyCoreMetricsViewEntity
          | MonthlyCoreMetricsViewEntity,
      ) => {
        let dateField: string;
        if ('date' in d) dateField = d.date;
        else if ('week' in d) dateField = d.week;
        else dateField = d.month;
        return {
          date: dateField,
          value: d.participationUserCount,
        };
      },
    );
    const coreChartData = processChartData(coreRawData, period);
    const totalCoreUsers =
      coreData?.reduce(
        (
          acc: number,
          curr:
            | DailyCoreMetricsViewEntity
            | WeeklyCoreMetricsViewEntity
            | MonthlyCoreMetricsViewEntity,
        ) => acc + curr.participationUserCount,
        0,
      ) || 0;
    const prevTotalCoreUsers =
      prevCoreData?.reduce(
        (
          acc: number,
          curr:
            | DailyCoreMetricsViewEntity
            | WeeklyCoreMetricsViewEntity
            | MonthlyCoreMetricsViewEntity,
        ) => acc + curr.participationUserCount,
        0,
      ) || 0;

    metrics.push({
      id: 'activeUsersCore',
      title: 'Active Users',
      subtitle: 'Core',
      value: totalCoreUsers.toLocaleString(),
      unit: '명',
      percentage: calculatePercentage(totalCoreUsers, prevTotalCoreUsers),
      chartData: coreChartData,
      chartLabel: `${periodPrefix} (Core)`,
    });

    // 신규 가입자
    const totalNewUsers =
      signupData?.reduce(
        (acc: number, curr: DailySignupMetricsViewEntity) =>
          acc + curr.newUserCount,
        0,
      ) || 0;
    const prevTotalNewUsers =
      prevSignupData?.reduce(
        (acc: number, curr: DailySignupMetricsViewEntity) =>
          acc + curr.newUserCount,
        0,
      ) || 0;

    const newUserRawData = signupData?.map(
      (d: DailySignupMetricsViewEntity) => ({
        date: d.date,
        value: d.newUserCount,
      }),
    );
    const newUsersChartData = processChartData(newUserRawData, period);

    metrics.push({
      id: 'newUsers',
      title: '신규 가입자 수',
      value: totalNewUsers.toLocaleString(),
      unit: '명',
      percentage: calculatePercentage(totalNewUsers, prevTotalNewUsers),
      chartData: newUsersChartData,
      chartLabel: '신규 가입자 수',
    });

    // GMV (총 거래액)
    const totalGmv =
      gmvData?.reduce(
        (acc: number, curr: DailyGmvMetricsViewEntity) => acc + curr.gmvAmount,
        0,
      ) || 0;
    const prevTotalGmv =
      prevGmvData?.reduce(
        (acc: number, curr: DailyGmvMetricsViewEntity) => acc + curr.gmvAmount,
        0,
      ) || 0;

    const gmvRawData = gmvData?.map((d: DailyGmvMetricsViewEntity) => ({
      date: d.date,
      value: d.gmvAmount,
    }));
    const gmvChartData = processChartData(gmvRawData, period);

    metrics.push({
      id: 'gmv',
      title: 'GMV',
      subtitle: '매출',
      value: totalGmv.toLocaleString(),
      unit: '원',
      percentage: calculatePercentage(totalGmv, prevTotalGmv),
      chartData: gmvChartData,
      chartLabel: 'GMV',
    });

    return metrics;
  }, [
    gmvData,
    prevGmvData,
    signupData,
    prevSignupData,
    period,
    exploreData,
    prevExploreData,
    coreData,
    prevCoreData,
  ]);

  return { processedMetrics };
};
