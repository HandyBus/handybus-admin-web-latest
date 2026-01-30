import { useMemo } from 'react';
import dayjs from 'dayjs';
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
import { calculatePercentage } from '@/app/(home)/utils/metrics.util';
import { getLatestDataDate } from '@/app/(home)/utils/dateNavigation.util';

interface UseGrowthMetricsDataProps {
  currentStartDate: string;
  currentEndDate: string;
  period: FilterPeriod;
}

export const useGrowthMetricsData = ({
  currentStartDate,
  currentEndDate,
  period,
}: UseGrowthMetricsDataProps) => {
  // --- 1. 날짜 계산 로직 (카드용 - 최근 기간) ---
  // 기간에 따라 "최근 완료된 기간"과 "그 직전 기간"을 계산합니다.
  const {
    cardRecentStartDate,
    cardRecentEndDate,
    cardPreStartDate,
    cardPreEndDate,
    criterionLabel,
  } = useMemo(() => {
    const today = dayjs();
    let rStart: string, rEnd: string;
    let pStart: string, pEnd: string;
    let label = '';

    if (period === '월간') {
      // 최근 완료된 달 (지난달)
      const lastMonth = today.subtract(1, 'month');
      rStart = lastMonth.startOf('month').format('YYYY-MM-DD');
      rEnd = lastMonth.endOf('month').format('YYYY-MM-DD');

      // 그 전달
      const preMonth = lastMonth.subtract(1, 'month');
      pStart = preMonth.startOf('month').format('YYYY-MM-DD');
      pEnd = preMonth.endOf('month').format('YYYY-MM-DD');

      label = '전 달 기준';
    } else if (period === '주간') {
      // 최근 완료된 주 (지난주 - ISO 기준 월~일)
      const lastWeek = today.subtract(1, 'week');
      rStart = lastWeek.startOf('isoWeek').format('YYYY-MM-DD');
      rEnd = lastWeek.endOf('isoWeek').format('YYYY-MM-DD');

      // 그 전주
      const preWeek = lastWeek.subtract(1, 'week');
      pStart = preWeek.startOf('isoWeek').format('YYYY-MM-DD');
      pEnd = preWeek.endOf('isoWeek').format('YYYY-MM-DD');

      label = '전 주 기준';
    } else {
      // 일간 (최신 데이터 기준)
      const latestDate = getLatestDataDate();
      rStart = latestDate.format('YYYY-MM-DD');
      rEnd = latestDate.format('YYYY-MM-DD');

      // 그 전날
      const preDay = latestDate.subtract(1, 'day');
      pStart = preDay.format('YYYY-MM-DD');
      pEnd = preDay.format('YYYY-MM-DD');

      label = '전 일 기준';
    }

    return {
      cardRecentStartDate: rStart,
      cardRecentEndDate: rEnd,
      cardPreStartDate: pStart,
      cardPreEndDate: pEnd,
      criterionLabel: label,
    };
  }, [period]);

  // --- 2. Chart Data Fetching (기존 로직 유지 - 선택된 기간 기준) ---
  const { currentData: chartGmvData } = useComparisonQuery({
    queryKey: ['daily-gmv-metrics-chart'],
    fetcher: getDailyGmvMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '', // 차트에는 비교 데이터 불필요
    prevEndDate: '',
    enabled: true,
  });

  const { currentData: chartSignupData } = useComparisonQuery({
    queryKey: ['daily-signup-metrics-chart'],
    fetcher: getDailySignupMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: true,
  });

  const { currentData: chartDailyExploreData } = useComparisonQuery({
    queryKey: ['daily-explore-metrics-chart'],
    fetcher: getDailyExploreMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: period === '일간',
  });
  const { currentData: chartWeeklyExploreData } = useComparisonQuery({
    queryKey: ['weekly-explore-metrics-chart'],
    fetcher: getWeeklyExploreMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: period === '주간',
  });
  const { currentData: chartMonthlyExploreData } = useComparisonQuery({
    queryKey: ['monthly-explore-metrics-chart'],
    fetcher: getMonthlyExploreMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: period !== '일간' && period !== '주간',
  });

  const { currentData: chartDailyCoreData } = useComparisonQuery({
    queryKey: ['daily-core-metrics-chart'],
    fetcher: getDailyCoreMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: period === '일간',
  });
  const { currentData: chartWeeklyCoreData } = useComparisonQuery({
    queryKey: ['weekly-core-metrics-chart'],
    fetcher: getWeeklyCoreMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: period === '주간',
  });
  const { currentData: chartMonthlyCoreData } = useComparisonQuery({
    queryKey: ['monthly-core-metrics-chart'],
    fetcher: getMonthlyCoreMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: period !== '일간' && period !== '주간',
  });

  // --- 3. Card Data Fetching (새로운 로직 - Card Recent Period 기준) ---
  // GMV & Signup
  const { currentData: cardGmvData, prevData: cardPreGmvData } =
    useComparisonQuery({
      queryKey: ['daily-gmv-metrics-card', cardRecentStartDate],
      fetcher: getDailyGmvMetrics,
      currentStartDate: cardRecentStartDate,
      currentEndDate: cardRecentEndDate,
      prevStartDate: cardPreStartDate,
      prevEndDate: cardPreEndDate,
      enabled: true,
    });

  const { currentData: cardSignupData, prevData: cardPreSignupData } =
    useComparisonQuery({
      queryKey: ['daily-signup-metrics-card', cardRecentStartDate],
      fetcher: getDailySignupMetrics,
      currentStartDate: cardRecentStartDate,
      currentEndDate: cardRecentEndDate,
      prevStartDate: cardPreStartDate,
      prevEndDate: cardPreEndDate,
      enabled: true,
    });

  // Explore & Core (Period에 따라 fetcher 달라짐)
  // 일간
  const {
    currentData: cardDailyExploreData,
    prevData: cardPreDailyExploreData,
  } = useComparisonQuery({
    queryKey: ['daily-explore-metrics-card', cardRecentStartDate],
    fetcher: getDailyExploreMetrics,
    currentStartDate: cardRecentStartDate,
    currentEndDate: cardRecentEndDate,
    prevStartDate: cardPreStartDate,
    prevEndDate: cardPreEndDate,
    enabled: period === '일간',
  });
  const { currentData: cardDailyCoreData, prevData: cardPreDailyCoreData } =
    useComparisonQuery({
      queryKey: ['daily-core-metrics-card', cardRecentStartDate],
      fetcher: getDailyCoreMetrics,
      currentStartDate: cardRecentStartDate,
      currentEndDate: cardRecentEndDate,
      prevStartDate: cardPreStartDate,
      prevEndDate: cardPreEndDate,
      enabled: period === '일간',
    });

  // 주간
  const {
    currentData: cardWeeklyExploreData,
    prevData: cardPreWeeklyExploreData,
  } = useComparisonQuery({
    queryKey: ['weekly-explore-metrics-card', cardRecentStartDate],
    fetcher: getWeeklyExploreMetrics,
    currentStartDate: cardRecentStartDate,
    currentEndDate: cardRecentEndDate,
    prevStartDate: cardPreStartDate,
    prevEndDate: cardPreEndDate,
    enabled: period === '주간',
  });
  const { currentData: cardWeeklyCoreData, prevData: cardPreWeeklyCoreData } =
    useComparisonQuery({
      queryKey: ['weekly-core-metrics-card', cardRecentStartDate],
      fetcher: getWeeklyCoreMetrics,
      currentStartDate: cardRecentStartDate,
      currentEndDate: cardRecentEndDate,
      prevStartDate: cardPreStartDate,
      prevEndDate: cardPreEndDate,
      enabled: period === '주간',
    });

  // 월간
  const {
    currentData: cardMonthlyExploreData,
    prevData: cardPreMonthlyExploreData,
  } = useComparisonQuery({
    queryKey: ['monthly-explore-metrics-card', cardRecentStartDate],
    fetcher: getMonthlyExploreMetrics,
    currentStartDate: cardRecentStartDate,
    currentEndDate: cardRecentEndDate,
    prevStartDate: cardPreStartDate,
    prevEndDate: cardPreEndDate,
    enabled: period === '월간',
  });
  const { currentData: cardMonthlyCoreData, prevData: cardPreMonthlyCoreData } =
    useComparisonQuery({
      queryKey: ['monthly-core-metrics-card', cardRecentStartDate],
      fetcher: getMonthlyCoreMetrics,
      currentStartDate: cardRecentStartDate,
      currentEndDate: cardRecentEndDate,
      prevStartDate: cardPreStartDate,
      prevEndDate: cardPreEndDate,
      enabled: period === '월간',
    });

  // --- 4. 데이터 통합 및 가공 ---

  // 차트용 데이터 선택
  const chartExploreData = useMemo(() => {
    if (period === '일간') return chartDailyExploreData;
    if (period === '주간') return chartWeeklyExploreData;
    return chartMonthlyExploreData;
  }, [
    period,
    chartDailyExploreData,
    chartWeeklyExploreData,
    chartMonthlyExploreData,
  ]);

  const chartCoreData = useMemo(() => {
    if (period === '일간') return chartDailyCoreData;
    if (period === '주간') return chartWeeklyCoreData;
    return chartMonthlyCoreData;
  }, [period, chartDailyCoreData, chartWeeklyCoreData, chartMonthlyCoreData]);

  // 카드용 데이터 선택 (Recent)
  const cardExploreData = useMemo(() => {
    if (period === '일간') return cardDailyExploreData;
    if (period === '주간') return cardWeeklyExploreData;
    return cardMonthlyExploreData;
  }, [
    period,
    cardDailyExploreData,
    cardWeeklyExploreData,
    cardMonthlyExploreData,
  ]);

  const cardCoreData = useMemo(() => {
    if (period === '일간') return cardDailyCoreData;
    if (period === '주간') return cardWeeklyCoreData;
    return cardMonthlyCoreData;
  }, [period, cardDailyCoreData, cardWeeklyCoreData, cardMonthlyCoreData]);

  // 카드용 데이터 선택 (Pre-Recent)
  const cardPreExploreData = useMemo(() => {
    if (period === '일간') return cardPreDailyExploreData;
    if (period === '주간') return cardPreWeeklyExploreData;
    return cardPreMonthlyExploreData;
  }, [
    period,
    cardPreDailyExploreData,
    cardPreWeeklyExploreData,
    cardPreMonthlyExploreData,
  ]);

  const cardPreCoreData = useMemo(() => {
    if (period === '일간') return cardPreDailyCoreData;
    if (period === '주간') return cardPreWeeklyCoreData;
    return cardPreMonthlyCoreData;
  }, [
    period,
    cardPreDailyCoreData,
    cardPreWeeklyCoreData,
    cardPreMonthlyCoreData,
  ]);

  // 기간 라벨 접두사 생성
  const getPeriodLabelPrefix = (currentPeriod: FilterPeriod): string => {
    if (currentPeriod === '일간') return 'DAU';
    if (currentPeriod === '주간') return 'WAU';
    return 'MAU';
  };

  const processedMetrics: MetricData[] = useMemo(() => {
    const metrics: MetricData[] = [];
    const periodPrefix = getPeriodLabelPrefix(period);

    // 1. 활성 사용자 (Explore)
    // Card Value: cardExploreData의 마지막 값 (단일 값) 사용
    const lastExploreData = cardExploreData?.[cardExploreData.length - 1];
    const totalExploreUsers = lastExploreData?.pageReachUserCount || 0;

    const lastPreExploreData =
      cardPreExploreData?.[cardPreExploreData.length - 1];
    const preTotalExploreUsers = lastPreExploreData?.pageReachUserCount || 0;

    // Chart Data: chartExploreData 사용
    const exploreRawData = chartExploreData?.map(
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

    metrics.push({
      id: 'activeUsersExplore',
      title: `${periodPrefix}`, // DAU/WAU/MAU
      subtitle: 'Explore',
      value: totalExploreUsers.toLocaleString(),
      unit: '명',
      percentage: calculatePercentage(totalExploreUsers, preTotalExploreUsers),
      criterionLabel: criterionLabel,
      chartData: exploreChartData,
      chartLabel: `${periodPrefix} (Explore)`,
    });

    // 2. 활성 사용자 (Core)
    const lastCoreData = cardCoreData?.[cardCoreData.length - 1];
    const totalCoreUsers = lastCoreData?.participationUserCount || 0;

    const lastPreCoreData = cardPreCoreData?.[cardPreCoreData.length - 1];
    const preTotalCoreUsers = lastPreCoreData?.participationUserCount || 0;

    const coreRawData = chartCoreData?.map(
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

    metrics.push({
      id: 'activeUsersCore',
      title: `${periodPrefix}`, // DAU/WAU/MAU
      subtitle: 'Core',
      value: totalCoreUsers.toLocaleString(),
      unit: '명',
      percentage: calculatePercentage(totalCoreUsers, preTotalCoreUsers),
      criterionLabel: criterionLabel,
      chartData: coreChartData,
      chartLabel: `${periodPrefix} (Core)`,
    });

    // 3. 신규 가입자
    const totalNewUsers =
      cardSignupData?.reduce(
        (acc: number, curr: DailySignupMetricsViewEntity) =>
          acc + curr.newUserCount,
        0,
      ) || 0;
    const preTotalNewUsers =
      cardPreSignupData?.reduce(
        (acc: number, curr: DailySignupMetricsViewEntity) =>
          acc + curr.newUserCount,
        0,
      ) || 0;

    const newUserRawData = chartSignupData?.map(
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
      percentage: calculatePercentage(totalNewUsers, preTotalNewUsers),
      criterionLabel: criterionLabel,
      chartData: newUsersChartData,
      chartLabel: '신규 가입자 수',
    });

    // 4. GMV
    const totalGmv =
      cardGmvData?.reduce(
        (acc: number, curr: DailyGmvMetricsViewEntity) => acc + curr.gmvAmount,
        0,
      ) || 0;
    const preTotalGmv =
      cardPreGmvData?.reduce(
        (acc: number, curr: DailyGmvMetricsViewEntity) => acc + curr.gmvAmount,
        0,
      ) || 0;

    const gmvRawData = chartGmvData?.map((d: DailyGmvMetricsViewEntity) => ({
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
      percentage: calculatePercentage(totalGmv, preTotalGmv),
      criterionLabel: criterionLabel,
      chartData: gmvChartData,
      chartLabel: 'GMV',
    });

    return metrics;
  }, [
    period,
    criterionLabel,
    // Card Data
    cardExploreData,
    cardPreExploreData,
    cardCoreData,
    cardPreCoreData,
    cardSignupData,
    cardPreSignupData,
    cardGmvData,
    cardPreGmvData,
    // Chart Data
    chartExploreData,
    chartCoreData,
    chartSignupData,
    chartGmvData,
  ]);

  return { processedMetrics };
};
