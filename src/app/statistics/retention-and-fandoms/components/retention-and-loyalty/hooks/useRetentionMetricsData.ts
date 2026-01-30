import { useMemo } from 'react';

import {
  getDailyRetentionMetrics,
  getDailyCoreMetrics,
} from '@/services/analytics.service';
import { useComparisonQuery } from '@/app/(home)/hooks/useComparisonQuery';
import { MetricData } from '@/app/(home)/types/types';
import { processChartData } from '@/app/(home)/utils/chartData.util';
import { calculatePercentage } from '@/app/(home)/utils/metrics.util';
import { getLatestDataDate } from '@/app/(home)/utils/dateNavigation.util';
import {
  DailyRetentionMetricsReadModel,
  DailyCoreMetricsViewEntity,
} from '@/types/analytics.type';

interface UseRetentionMetricsDataProps {
  currentStartDate: string;
  currentEndDate: string;
}

export const hoursToDays = (hours: number) => {
  if (!hours) return 0;
  return parseFloat((hours / 24).toFixed(1));
};

export const safeRate = (numerator: number, denominator: number) => {
  if (!denominator || denominator === 0) return 0;
  return parseFloat(((numerator / denominator) * 100).toFixed(1));
};

export const useRetentionMetricsData = ({
  currentStartDate,
  currentEndDate,
}: UseRetentionMetricsDataProps) => {
  // --- 1. 날짜 계산 로직 (지표 카드용 - 어제 vs 그제) ---
  const {
    cardRecentStartDate,
    cardRecentEndDate,
    cardPreStartDate,
    cardPreEndDate,
    criterionLabel,
  } = useMemo(() => {
    // 일간 (최신 데이터 기준)
    const latestDate = getLatestDataDate();
    const rStart = latestDate.format('YYYY-MM-DD');
    const rEnd = latestDate.format('YYYY-MM-DD');

    // 그 전날
    const preDay = latestDate.subtract(1, 'day');
    const pStart = preDay.format('YYYY-MM-DD');
    const pEnd = preDay.format('YYYY-MM-DD');

    return {
      cardRecentStartDate: rStart,
      cardRecentEndDate: rEnd,
      cardPreStartDate: pStart,
      cardPreEndDate: pEnd,
      criterionLabel: '전 일 기준',
    };
  }, []);

  // --- 2. 데이터 페칭 (Data Fetching) ---

  // A. 차트용 데이터 (선택된 기간)
  const { currentData: chartRetentionData } = useComparisonQuery({
    queryKey: ['daily-retention-metrics-chart'],
    fetcher: getDailyRetentionMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: true,
  });

  const { currentData: chartCoreData } = useComparisonQuery({
    queryKey: ['daily-core-metrics-chart'],
    fetcher: getDailyCoreMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: true,
  });

  // B. 지표 카드용 데이터 (어제 vs 그제)
  // 최근 데이터 (어제)
  const { currentData: cardRetentionData, prevData: cardPreRetentionData } =
    useComparisonQuery({
      queryKey: ['daily-retention-metrics-card', cardRecentStartDate],
      fetcher: getDailyRetentionMetrics,
      currentStartDate: cardRecentStartDate,
      currentEndDate: cardRecentEndDate,
      prevStartDate: cardPreStartDate,
      prevEndDate: cardPreEndDate,
      enabled: true,
    });

  const { currentData: cardCoreData, prevData: cardPreCoreData } =
    useComparisonQuery({
      queryKey: ['daily-core-metrics-card', cardRecentStartDate],
      fetcher: getDailyCoreMetrics,
      currentStartDate: cardRecentStartDate,
      currentEndDate: cardRecentEndDate,
      prevStartDate: cardPreStartDate,
      prevEndDate: cardPreEndDate,
      enabled: true,
    });

  const processedMetrics: MetricData[] = useMemo(() => {
    // 1. 차트용 일별 시계열 데이터 계산
    const dailySeries = calculateDailyMetrics(
      chartRetentionData,
      chartCoreData,
    );

    // 2. 어제(최근 1일) 지표 계산
    // 특정 하루만 요청했으므로 배열의 첫 번째 요소[0]를 사용합니다.
    const recentMetrics = calculateSingleDayMetrics(
      cardRetentionData?.[0],
      cardCoreData?.[0],
    );

    // 3. 그저께(이전 1일) 지표 계산
    // 전 일 기준 변화율 계산을 위해 사용합니다.
    const preMetrics = calculateSingleDayMetrics(
      cardPreRetentionData?.[0],
      cardPreCoreData?.[0],
    );

    // 4. MetricData 객체 구성
    const metrics: MetricData[] = [];

    const getChartData = (key: keyof typeof recentMetrics) => {
      const raw = dailySeries.map((d) => ({
        date: d.date,
        value: d[key] as number,
      }));

      return processChartData(raw, '일간');
    };

    // 지표 1: 행사 재참여율
    metrics.push({
      id: 'reparticipation_rate',
      title: '행사 재참여율',
      value: `${recentMetrics.reparticipationRate}%`,
      unit: '',
      percentage: calculatePercentage(
        recentMetrics.reparticipationRate,
        preMetrics.reparticipationRate,
      ),
      criterionLabel,
      chartData: getChartData('reparticipationRate'),
      chartLabel: '행사 재참여율(%)',
    });

    // 지표 2: 행사 재참여주기
    metrics.push({
      id: 'reparticipation_cycle',
      title: '행사 재참여주기',
      value: `${recentMetrics.reparticipationCycle}일`,
      unit: '',
      percentage: calculatePercentage(
        recentMetrics.reparticipationCycle,
        preMetrics.reparticipationCycle,
      ),
      criterionLabel,
      chartData: getChartData('reparticipationCycle'),
      chartLabel: '행사 재참여주기(일)',
    });

    // 지표 3: 행사 재예매율
    metrics.push({
      id: 'rebooking_rate',
      title: '행사 재예매율',
      value: `${recentMetrics.rebookingRate}%`,
      unit: '',
      percentage: calculatePercentage(
        recentMetrics.rebookingRate,
        preMetrics.rebookingRate,
      ),
      criterionLabel,
      chartData: getChartData('rebookingRate'),
      chartLabel: '행사 재예매율(%)',
    });

    // 지표 4: 행사 재예약주기
    metrics.push({
      id: 'rebooking_cycle',
      title: '행사 재예약주기',
      value: `${recentMetrics.rebookingCycle}일`,
      unit: '',
      percentage: calculatePercentage(
        recentMetrics.rebookingCycle,
        preMetrics.rebookingCycle,
      ),
      criterionLabel,
      chartData: getChartData('rebookingCycle'),
      chartLabel: '행사 재예약주기(일)',
    });

    // 지표 5: 재탑승주기
    metrics.push({
      id: 'reboarding_cycle',
      title: '재탑승주기',
      value: `${recentMetrics.reboardingCycle}일`,
      unit: '',
      percentage: calculatePercentage(
        recentMetrics.reboardingCycle,
        preMetrics.reboardingCycle,
      ),
      criterionLabel,
      chartData: getChartData('reboardingCycle'),
      chartLabel: '재탑승주기(일)',
    });

    return metrics;
  }, [
    chartRetentionData,
    chartCoreData,
    cardRetentionData,
    cardCoreData,
    cardPreRetentionData,
    cardPreCoreData,
    criterionLabel,
  ]);

  return { processedMetrics };
};

// --- 3. 데이터 가공 로직 (Data Processing) ---

// 차트를 그리기 위한 리스트 데이터 계산
export const calculateDailyMetrics = (
  retentionList: DailyRetentionMetricsReadModel[] = [],
  coreList: DailyCoreMetricsViewEntity[] = [],
) => {
  const coreMap = new Map(coreList.map((c) => [c.date, c]));

  return retentionList.map((r) => {
    const core = coreMap.get(r.date);
    const participationUserCount = core?.participationUserCount || 0;
    const reservationUserCount = core?.reservationUserCount || 0;

    return {
      date: r.date,
      reparticipationRate: safeRate(
        r.eventReparticipationUserCount,
        participationUserCount,
      ),
      reparticipationCycle: hoursToDays(r.averageUserEventReparticipationHours),
      rebookingRate: safeRate(r.eventRebookingUserCount, reservationUserCount),
      rebookingCycle: hoursToDays(r.averageUserEventRebookingHours),
      reboardingCycle: r.averageUserReboardingDays, // 응답데이터가 이미 일별
    };
  });
};

// 지표카드에 반영하기 위한 단일 데이터 계산
export const calculateSingleDayMetrics = (
  retention: DailyRetentionMetricsReadModel | undefined,
  core: DailyCoreMetricsViewEntity | undefined,
) => {
  if (!retention || !core) {
    return {
      reparticipationRate: 0,
      reparticipationCycle: 0,
      rebookingRate: 0,
      rebookingCycle: 0,
      reboardingCycle: 0,
    };
  }

  return {
    reparticipationRate: safeRate(
      retention.eventReparticipationUserCount,
      core.participationUserCount,
    ),
    reparticipationCycle: hoursToDays(
      retention.averageUserEventReparticipationHours,
    ),
    rebookingRate: safeRate(
      retention.eventRebookingUserCount,
      core.reservationUserCount,
    ),
    rebookingCycle: hoursToDays(retention.averageUserEventRebookingHours),
    reboardingCycle: retention.averageUserReboardingDays,
  };
};
