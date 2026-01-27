import { useMemo } from 'react';
import dayjs from 'dayjs';
import {
  getDailyExploreMetrics,
  getWeeklyExploreMetrics,
  getMonthlyExploreMetrics,
  getDailyCoreMetrics,
  getWeeklyCoreMetrics,
  getMonthlyCoreMetrics,
} from '@/services/analytics.service';
import { useComparisonQuery } from '@/app/(home)/hooks/useComparisonQuery';
import { MetricData, FilterPeriod } from '@/app/(home)/types/types';
import { processChartData } from '@/app/(home)/utils/chartData.util';

import {
  DailyCoreMetricsViewEntity,
  DailyExploreMetricsViewEntity,
  MonthlyCoreMetricsViewEntity,
  MonthlyExploreMetricsViewEntity,
  WeeklyCoreMetricsViewEntity,
  WeeklyExploreMetricsViewEntity,
} from '@/types/analytics.type';

interface UseElasticityMetricsDataProps {
  currentStartDate: string;
  currentEndDate: string;
  selectedUnit: FilterPeriod; // '일간' | '주간' | '월간'
}

type ExploreMetric =
  | DailyExploreMetricsViewEntity
  | WeeklyExploreMetricsViewEntity
  | MonthlyExploreMetricsViewEntity;

type CoreMetric =
  | DailyCoreMetricsViewEntity
  | WeeklyCoreMetricsViewEntity
  | MonthlyCoreMetricsViewEntity;

export const useElasticityMetricsData = ({
  currentStartDate,
  currentEndDate,
  selectedUnit,
}: UseElasticityMetricsDataProps) => {
  // --- 1. 카드 데이터 페칭 (최근 완료된 기간) ---
  const {
    cardRecentStartDate,
    cardRecentEndDate,
    cardPreStartDate,
    cardPreEndDate,
  } = useMemo(() => {
    const today = dayjs();

    // 일간 (어제)
    const yesterday = today.subtract(1, 'day');
    const dStart = yesterday.format('YYYY-MM-DD');
    const dEnd = yesterday.format('YYYY-MM-DD');
    const preD = yesterday.subtract(1, 'day');
    const pdStart = preD.format('YYYY-MM-DD');
    const pdEnd = preD.format('YYYY-MM-DD');

    // 주간 (지난주)
    const lastWeek = today.subtract(1, 'week');
    const wStart = lastWeek.startOf('isoWeek').format('YYYY-MM-DD');
    const wEnd = lastWeek.endOf('isoWeek').format('YYYY-MM-DD');
    const preW = lastWeek.subtract(1, 'week');
    const pwStart = preW.startOf('isoWeek').format('YYYY-MM-DD');
    const pwEnd = preW.endOf('isoWeek').format('YYYY-MM-DD');

    // 월간 (지난달)
    const lastMonth = today.subtract(1, 'month');
    const mStart = lastMonth.startOf('month').format('YYYY-MM-DD');
    const mEnd = lastMonth.endOf('month').format('YYYY-MM-DD');
    const preM = lastMonth.subtract(1, 'month');
    const pmStart = preM.startOf('month').format('YYYY-MM-DD');
    const pmEnd = preM.endOf('month').format('YYYY-MM-DD');

    return {
      cardRecentStartDate: { daily: dStart, weekly: wStart, monthly: mStart },
      cardRecentEndDate: { daily: dEnd, weekly: wEnd, monthly: mEnd },
      cardPreStartDate: { daily: pdStart, weekly: pwStart, monthly: pmStart },
      cardPreEndDate: { daily: pdEnd, weekly: pwEnd, monthly: pmEnd },
    };
  }, []);

  // "최근" 및 "이전" 데이터를 가져오기 위해 각 카드 유형별로 비교 쿼리 사용
  // 일간
  const { currentData: dailyExplore, prevData: preDailyExplore } =
    useComparisonQuery({
      queryKey: ['daily-explore-elasticity-card', cardRecentStartDate.daily],
      fetcher: getDailyExploreMetrics,
      currentStartDate: cardRecentStartDate.daily,
      currentEndDate: cardRecentEndDate.daily,
      prevStartDate: cardPreStartDate.daily,
      prevEndDate: cardPreEndDate.daily,
      enabled: true,
    });
  const { currentData: dailyCore, prevData: preDailyCore } = useComparisonQuery(
    {
      queryKey: ['daily-core-elasticity-card', cardRecentStartDate.daily],
      fetcher: getDailyCoreMetrics,
      currentStartDate: cardRecentStartDate.daily,
      currentEndDate: cardRecentEndDate.daily,
      prevStartDate: cardPreStartDate.daily,
      prevEndDate: cardPreEndDate.daily,
      enabled: true,
    },
  );

  // 주간
  const { currentData: weeklyExplore, prevData: preWeeklyExplore } =
    useComparisonQuery({
      queryKey: ['weekly-explore-elasticity-card', cardRecentStartDate.weekly],
      fetcher: getWeeklyExploreMetrics,
      currentStartDate: cardRecentStartDate.weekly,
      currentEndDate: cardRecentEndDate.weekly,
      prevStartDate: cardPreStartDate.weekly,
      prevEndDate: cardPreEndDate.weekly,
      enabled: true,
    });
  const { currentData: weeklyCore, prevData: preWeeklyCore } =
    useComparisonQuery({
      queryKey: ['weekly-core-elasticity-card', cardRecentStartDate.weekly],
      fetcher: getWeeklyCoreMetrics,
      currentStartDate: cardRecentStartDate.weekly,
      currentEndDate: cardRecentEndDate.weekly,
      prevStartDate: cardPreStartDate.weekly,
      prevEndDate: cardPreEndDate.weekly,
      enabled: true,
    });

  // 월간
  const { currentData: monthlyExplore, prevData: preMonthlyExplore } =
    useComparisonQuery({
      queryKey: [
        'monthly-explore-elasticity-card',
        cardRecentStartDate.monthly,
      ],
      fetcher: getMonthlyExploreMetrics,
      currentStartDate: cardRecentStartDate.monthly,
      currentEndDate: cardRecentEndDate.monthly,
      prevStartDate: cardPreStartDate.monthly,
      prevEndDate: cardPreEndDate.monthly,
      enabled: true,
    });
  const { currentData: monthlyCore, prevData: preMonthlyCore } =
    useComparisonQuery({
      queryKey: ['monthly-core-elasticity-card', cardRecentStartDate.monthly],
      fetcher: getMonthlyCoreMetrics,
      currentStartDate: cardRecentStartDate.monthly,
      currentEndDate: cardRecentEndDate.monthly,
      prevStartDate: cardPreStartDate.monthly,
      prevEndDate: cardPreEndDate.monthly,
      enabled: true,
    });

  // --- 2. 차트 데이터 페칭 (날짜 범위) ---
  const chartFetchStartDate = useMemo(() => {
    const s = dayjs(currentStartDate);
    if (selectedUnit === '월간')
      return s.subtract(1, 'month').format('YYYY-MM-DD');
    if (selectedUnit === '주간')
      return s.subtract(1, 'week').format('YYYY-MM-DD');
    return s.subtract(1, 'day').format('YYYY-MM-DD');
  }, [currentStartDate, selectedUnit]);

  // 타입 안전성을 위해 쿼리 분리
  const { currentData: rawChartDailyExplore } = useComparisonQuery({
    queryKey: [
      'daily-explore-elasticity-chart',
      chartFetchStartDate,
      currentEndDate,
    ],
    fetcher: getDailyExploreMetrics,
    currentStartDate: chartFetchStartDate,
    currentEndDate: currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: selectedUnit === '일간',
  });

  const { currentData: rawChartWeeklyExplore } = useComparisonQuery({
    queryKey: [
      'weekly-explore-elasticity-chart',
      chartFetchStartDate,
      currentEndDate,
    ],
    fetcher: getWeeklyExploreMetrics,
    currentStartDate: chartFetchStartDate,
    currentEndDate: currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: selectedUnit === '주간',
  });

  const { currentData: rawChartMonthlyExplore } = useComparisonQuery({
    queryKey: [
      'monthly-explore-elasticity-chart',
      chartFetchStartDate,
      currentEndDate,
    ],
    fetcher: getMonthlyExploreMetrics,
    currentStartDate: chartFetchStartDate,
    currentEndDate: currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: selectedUnit === '월간',
  });

  const { currentData: rawChartDailyCore } = useComparisonQuery({
    queryKey: [
      'daily-core-elasticity-chart',
      chartFetchStartDate,
      currentEndDate,
    ],
    fetcher: getDailyCoreMetrics,
    currentStartDate: chartFetchStartDate,
    currentEndDate: currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: selectedUnit === '일간',
  });

  const { currentData: rawChartWeeklyCore } = useComparisonQuery({
    queryKey: [
      'weekly-core-elasticity-chart',
      chartFetchStartDate,
      currentEndDate,
    ],
    fetcher: getWeeklyCoreMetrics,
    currentStartDate: chartFetchStartDate,
    currentEndDate: currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: selectedUnit === '주간',
  });

  const { currentData: rawChartMonthlyCore } = useComparisonQuery({
    queryKey: [
      'monthly-core-elasticity-chart',
      chartFetchStartDate,
      currentEndDate,
    ],
    fetcher: getMonthlyCoreMetrics,
    currentStartDate: chartFetchStartDate,
    currentEndDate: currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: selectedUnit === '월간',
  });

  // 활성 데이터 선택
  const chartExplore = useMemo(() => {
    if (selectedUnit === '일간') return rawChartDailyExplore;
    if (selectedUnit === '주간') return rawChartWeeklyExplore;
    return rawChartMonthlyExplore;
  }, [
    selectedUnit,
    rawChartDailyExplore,
    rawChartWeeklyExplore,
    rawChartMonthlyExplore,
  ]);

  const chartCore = useMemo(() => {
    if (selectedUnit === '일간') return rawChartDailyCore;
    if (selectedUnit === '주간') return rawChartWeeklyCore;
    return rawChartMonthlyCore;
  }, [
    selectedUnit,
    rawChartDailyCore,
    rawChartWeeklyCore,
    rawChartMonthlyCore,
  ]);

  // --- 3. 계산 및 가공 ---
  const calculateElasticity = (
    coreCurr: number,
    corePrev: number,
    exploreCurr: number,
    explorePrev: number,
  ) => {
    if (corePrev === 0 || explorePrev === 0 || exploreCurr === 0) return 0;
    const coreGrowthFactor = coreCurr / corePrev;
    const exploreGrowthFactor = exploreCurr / explorePrev;
    if (exploreGrowthFactor === 0) return 0; // 0으로 나누기 방지
    return coreGrowthFactor / exploreGrowthFactor;
  };

  const processedMetrics: MetricData[] = useMemo(() => {
    const metrics: MetricData[] = [];

    // 공통 날짜 추출 헬퍼
    const getDate = (item: ExploreMetric | CoreMetric): string => {
      if ('date' in item) return item.date;
      if ('week' in item) return item.week;
      if ('month' in item) return item.month;
      return '';
    };

    // 값을 추출하기 위한 헬퍼 함수 (마지막 요소)
    // 제네릭 사용 안함, 각 타입 명시적으로 처리
    const getLastExploreValue = (
      data: ExploreMetric[] | undefined | null,
    ): number => {
      if (!data || data.length === 0) return 0;
      return data[data.length - 1].pageReachUserCount;
    };

    const getLastCoreValue = (
      data: CoreMetric[] | undefined | null,
    ): number => {
      if (!data || data.length === 0) return 0;
      return data[data.length - 1].participationUserCount;
    };

    // 1. DAU 탄력성 카드
    const dauCoreCurr = getLastCoreValue(dailyCore);
    const dauCorePrev = getLastCoreValue(preDailyCore);
    const dauExploreCurr = getLastExploreValue(dailyExplore);
    const dauExplorePrev = getLastExploreValue(preDailyExplore);

    const dauElasticity = calculateElasticity(
      dauCoreCurr,
      dauCorePrev,
      dauExploreCurr,
      dauExplorePrev,
    );

    // 2. WAU 탄력성 카드
    const wauCoreCurr = getLastCoreValue(weeklyCore);
    const wauCorePrev = getLastCoreValue(preWeeklyCore);
    const wauExploreCurr = getLastExploreValue(weeklyExplore);
    const wauExplorePrev = getLastExploreValue(preWeeklyExplore);

    const wauElasticity = calculateElasticity(
      wauCoreCurr,
      wauCorePrev,
      wauExploreCurr,
      wauExplorePrev,
    );

    // 3. MAU 탄력성 카드
    const mauCoreCurr = getLastCoreValue(monthlyCore);
    const mauCorePrev = getLastCoreValue(preMonthlyCore);
    const mauExploreCurr = getLastExploreValue(monthlyExplore);
    const mauExplorePrev = getLastExploreValue(preMonthlyExplore);

    const mauElasticity = calculateElasticity(
      mauCoreCurr,
      mauCorePrev,
      mauExploreCurr,
      mauExplorePrev,
    );

    // 4. 차트 데이터 구성
    const chartPoints: { date: string; value: number }[] = [];

    // selectedUnit에 의해 정렬된다는 것을 알고 있으므로 복잡한 TS 캐스팅 방지
    if (chartCore && chartExplore && chartCore.length === chartExplore.length) {
      for (let i = 1; i < chartCore.length; i++) {
        // CoreMetric, ExploreMetric 유니온 타입으로 캐스팅
        const currCore = chartCore[i] as CoreMetric;
        const prevCore = chartCore[i - 1] as CoreMetric;
        const currExplore = chartExplore[i] as ExploreMetric;
        const prevExplore = chartExplore[i - 1] as ExploreMetric;

        // 데이터 형태에 따라 date 속성 사용 (공통 함수 이용)
        const date = getDate(currCore);

        if (!date) continue;

        // 날짜가 일치하는지 확인
        const exploreDate = getDate(currExplore);
        if (exploreDate !== date) continue;

        const cVal = currCore.participationUserCount;
        const pCVal = prevCore.participationUserCount;
        const eVal = currExplore.pageReachUserCount;
        const pEVal = prevExplore.pageReachUserCount;

        const val = calculateElasticity(cVal, pCVal, eVal, pEVal);

        // 오늘로부터 역산할 때 currentStartDate(필터 시작일) 이후 데이터만 포함
        if (dayjs(date).isSameOrAfter(dayjs(currentStartDate))) {
          chartPoints.push({ date, value: val });
        }
      }
    }

    // 라벨 포맷을 위해 processChartData 적용
    const formattedChartData = processChartData(chartPoints, selectedUnit);

    // 메트릭 데이터 구성
    metrics.push({
      id: 'elasticityDAU',
      title: 'DAU',
      subtitle: '변환 탄력성',
      value: dauElasticity.toFixed(2),
      unit: '',
      percentage: '',
      chartData: formattedChartData,
      chartLabel: `${selectedUnit} Explore -> Core 전환 탄력성`,
      criterionLabel: '전 일 기준',
    });

    metrics.push({
      id: 'elasticityWAU',
      title: 'WAU',
      subtitle: '변환 탄력성',
      value: wauElasticity.toFixed(2),
      unit: '',
      percentage: '',
      chartData: formattedChartData,
      chartLabel: `${selectedUnit} Explore -> Core 전환 탄력성`,
      criterionLabel: '전 주 기준',
    });

    metrics.push({
      id: 'elasticityMAU',
      title: 'MAU',
      subtitle: '변환 탄력성',
      value: mauElasticity.toFixed(2),
      unit: '',
      percentage: '',
      chartData: formattedChartData,
      chartLabel: `${selectedUnit} Explore -> Core 전환 탄력성`,
      criterionLabel: '전 달 기준',
    });

    return metrics;
  }, [
    dailyCore,
    preDailyCore,
    dailyExplore,
    preDailyExplore,
    weeklyCore,
    preWeeklyCore,
    weeklyExplore,
    preWeeklyExplore,
    monthlyCore,
    preMonthlyCore,
    monthlyExplore,
    preMonthlyExplore,
    chartCore,
    chartExplore,
    selectedUnit,
    currentStartDate,
  ]);
  // 참고: 위 useMemo 내부에서 모든 계산이 이루어지며, 필요한 외부 값들이 의존성 배열에 포함됨.

  return { processedMetrics };
};
