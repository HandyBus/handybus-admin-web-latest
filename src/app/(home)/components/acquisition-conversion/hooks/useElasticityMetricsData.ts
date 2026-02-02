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
import { getLatestDataDate } from '@/app/(home)/utils/dateNavigation.util';
import { calculatePercentage } from '@/app/(home)/utils/metrics.util';
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
    cardPrePreStartDate,
    cardPrePreEndDate,
  } = useMemo(() => {
    const today = dayjs();

    // 일간 (최신 데이터 기준)
    const latestDate = getLatestDataDate();
    const dStart = latestDate.format('YYYY-MM-DD');
    const dEnd = latestDate.format('YYYY-MM-DD');
    const preD = latestDate.subtract(1, 'day');
    const pdStart = preD.format('YYYY-MM-DD');
    const pdEnd = preD.format('YYYY-MM-DD');
    // 전전일 (전일 대비 변화율 계산용)
    const prePreD = preD.subtract(1, 'day');
    const ppdStart = prePreD.format('YYYY-MM-DD');
    const ppdEnd = prePreD.format('YYYY-MM-DD');

    // 주간 (지난주)
    const lastWeek = today.subtract(1, 'week');
    const wStart = lastWeek.startOf('isoWeek').format('YYYY-MM-DD');
    const wEnd = lastWeek.endOf('isoWeek').format('YYYY-MM-DD');
    const preW = lastWeek.subtract(1, 'week');
    const pwStart = preW.startOf('isoWeek').format('YYYY-MM-DD');
    const pwEnd = preW.endOf('isoWeek').format('YYYY-MM-DD');
    // 전전주
    const prePreW = preW.subtract(1, 'week');
    const ppwStart = prePreW.startOf('isoWeek').format('YYYY-MM-DD');
    const ppwEnd = prePreW.endOf('isoWeek').format('YYYY-MM-DD');

    // 월간 (지난달)
    const lastMonth = today.subtract(1, 'month');
    const mStart = lastMonth.startOf('month').format('YYYY-MM-DD');
    const mEnd = lastMonth.endOf('month').format('YYYY-MM-DD');
    const preM = lastMonth.subtract(1, 'month');
    const pmStart = preM.startOf('month').format('YYYY-MM-DD');
    const pmEnd = preM.endOf('month').format('YYYY-MM-DD');
    // 전전달
    const prePreM = preM.subtract(1, 'month');
    const ppmStart = prePreM.startOf('month').format('YYYY-MM-DD');
    const ppmEnd = prePreM.endOf('month').format('YYYY-MM-DD');

    return {
      cardRecentStartDate: { daily: dStart, weekly: wStart, monthly: mStart },
      cardRecentEndDate: { daily: dEnd, weekly: wEnd, monthly: mEnd },
      cardPreStartDate: { daily: pdStart, weekly: pwStart, monthly: pmStart },
      cardPreEndDate: { daily: pdEnd, weekly: pwEnd, monthly: pmEnd },
      cardPrePreStartDate: {
        daily: ppdStart,
        weekly: ppwStart,
        monthly: ppmStart,
      },
      cardPrePreEndDate: { daily: ppdEnd, weekly: ppwEnd, monthly: ppmEnd },
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

  // 일간 (이전 vs 전전) - 퍼센트 계산용
  const { prevData: prePreDailyExplore } = useComparisonQuery({
    queryKey: ['daily-explore-elasticity-card-pre', cardPreStartDate.daily],
    fetcher: getDailyExploreMetrics,
    currentStartDate: cardPreStartDate.daily,
    currentEndDate: cardPreEndDate.daily,
    prevStartDate: cardPrePreStartDate.daily,
    prevEndDate: cardPrePreEndDate.daily,
    enabled: true,
  });
  const { prevData: prePreDailyCore } = useComparisonQuery({
    queryKey: ['daily-core-elasticity-card-pre', cardPreStartDate.daily],
    fetcher: getDailyCoreMetrics,
    currentStartDate: cardPreStartDate.daily,
    currentEndDate: cardPreEndDate.daily,
    prevStartDate: cardPrePreStartDate.daily,
    prevEndDate: cardPrePreEndDate.daily,
    enabled: true,
  });

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

  // 주간 (이전 vs 전전) - 퍼센트 계산용
  const { prevData: prePreWeeklyExplore } = useComparisonQuery({
    queryKey: ['weekly-explore-elasticity-card-pre', cardPreStartDate.weekly],
    fetcher: getWeeklyExploreMetrics,
    currentStartDate: cardPreStartDate.weekly,
    currentEndDate: cardPreEndDate.weekly,
    prevStartDate: cardPrePreStartDate.weekly,
    prevEndDate: cardPrePreEndDate.weekly,
    enabled: true,
  });
  const { prevData: prePreWeeklyCore } = useComparisonQuery({
    queryKey: ['weekly-core-elasticity-card-pre', cardPreStartDate.weekly],
    fetcher: getWeeklyCoreMetrics,
    currentStartDate: cardPreStartDate.weekly,
    currentEndDate: cardPreEndDate.weekly,
    prevStartDate: cardPrePreStartDate.weekly,
    prevEndDate: cardPrePreEndDate.weekly,
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

  // 월간 (이전 vs 전전) - 퍼센트 계산용
  const { prevData: prePreMonthlyExplore } = useComparisonQuery({
    queryKey: ['monthly-explore-elasticity-card-pre', cardPreStartDate.monthly],
    fetcher: getMonthlyExploreMetrics,
    currentStartDate: cardPreStartDate.monthly,
    currentEndDate: cardPreEndDate.monthly,
    prevStartDate: cardPrePreStartDate.monthly,
    prevEndDate: cardPrePreEndDate.monthly,
    enabled: true,
  });
  const { prevData: prePreMonthlyCore } = useComparisonQuery({
    queryKey: ['monthly-core-elasticity-card-pre', cardPreStartDate.monthly],
    fetcher: getMonthlyCoreMetrics,
    currentStartDate: cardPreStartDate.monthly,
    currentEndDate: cardPreEndDate.monthly,
    prevStartDate: cardPrePreStartDate.monthly,
    prevEndDate: cardPrePreEndDate.monthly,
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
    const dauCorePrePre = getLastCoreValue(prePreDailyCore);
    const dauExplorePrePre = getLastExploreValue(prePreDailyExplore);

    const dauElasticity = calculateElasticity(
      dauCoreCurr,
      dauCorePrev,
      dauExploreCurr,
      dauExplorePrev,
    );

    const dauElasticityPrev = calculateElasticity(
      dauCorePrev,
      dauCorePrePre,
      dauExplorePrev,
      dauExplorePrePre,
    );

    // 2. WAU 탄력성 카드
    const wauCoreCurr = getLastCoreValue(weeklyCore);
    const wauCorePrev = getLastCoreValue(preWeeklyCore);
    const wauExploreCurr = getLastExploreValue(weeklyExplore);
    const wauExplorePrev = getLastExploreValue(preWeeklyExplore);
    const wauCorePrePre = getLastCoreValue(prePreWeeklyCore);
    const wauExplorePrePre = getLastExploreValue(prePreWeeklyExplore);

    const wauElasticity = calculateElasticity(
      wauCoreCurr,
      wauCorePrev,
      wauExploreCurr,
      wauExplorePrev,
    );

    const wauElasticityPrev = calculateElasticity(
      wauCorePrev,
      wauCorePrePre,
      wauExplorePrev,
      wauExplorePrePre,
    );

    // 3. MAU 탄력성 카드
    const mauCoreCurr = getLastCoreValue(monthlyCore);
    const mauCorePrev = getLastCoreValue(preMonthlyCore);
    const mauExploreCurr = getLastExploreValue(monthlyExplore);
    const mauExplorePrev = getLastExploreValue(preMonthlyExplore);
    const mauCorePrePre = getLastCoreValue(prePreMonthlyCore);
    const mauExplorePrePre = getLastExploreValue(prePreMonthlyExplore);

    const mauElasticity = calculateElasticity(
      mauCoreCurr,
      mauCorePrev,
      mauExploreCurr,
      mauExplorePrev,
    );

    const mauElasticityPrev = calculateElasticity(
      mauCorePrev,
      mauCorePrePre,
      mauExplorePrev,
      mauExplorePrePre,
    );

    // 4. 차트 데이터 구성
    const chartPoints: { date: string; value: number }[] = [];

    // selectedUnit에 의해 정렬된다는 것을 알고 있으므로 복잡한 TS 캐스팅 방지
    if (chartCore && chartExplore) {
      // Core 데이터 매핑
      const coreMap = new Map<string, CoreMetric>();
      chartCore.forEach((item) => {
        const d = getDate(item as CoreMetric);
        if (d) coreMap.set(d, item as CoreMetric);
      });

      // Explore 데이터 매핑
      const exploreMap = new Map<string, ExploreMetric>();
      chartExplore.forEach((item) => {
        const d = getDate(item as ExploreMetric);
        if (d) exploreMap.set(d, item as ExploreMetric);
      });

      // 날짜 정렬 (두 데이터 셋의 합집합)
      const allDates = Array.from(
        new Set([...coreMap.keys(), ...exploreMap.keys()]),
      ).sort();

      for (let i = 1; i < allDates.length; i++) {
        const date = allDates[i];
        const prevDate = allDates[i - 1];

        // 현재와 이전 날짜의 데이터가 모두 존재해야 탄력성 계산 가능 (변화율 기반이므로)
        const currCore = coreMap.get(date);
        const prevCore = coreMap.get(prevDate);
        const currExplore = exploreMap.get(date);
        const prevExplore = exploreMap.get(prevDate);

        // 하나라도 없으면 계산 불가
        if (!currCore || !prevCore || !currExplore || !prevExplore) continue;

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

    metrics.push({
      id: 'elasticityDAU',
      title: 'DAU',
      subtitle: '변환 탄력성',
      value: dauElasticity.toFixed(2),
      unit: '',
      percentage: calculatePercentage(dauElasticity, dauElasticityPrev),
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
      percentage: calculatePercentage(wauElasticity, wauElasticityPrev),
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
      percentage: calculatePercentage(mauElasticity, mauElasticityPrev),
      chartData: formattedChartData,
      chartLabel: `${selectedUnit} Explore -> Core 전환 탄력성`,
      criterionLabel: '전 달 기준',
    });

    return metrics;
  }, [
    dailyCore,
    preDailyCore,
    prePreDailyCore,
    dailyExplore,
    preDailyExplore,
    prePreDailyExplore,
    weeklyCore,
    preWeeklyCore,
    prePreWeeklyCore,
    weeklyExplore,
    preWeeklyExplore,
    prePreWeeklyExplore,
    monthlyCore,
    preMonthlyCore,
    prePreMonthlyCore,
    monthlyExplore,
    preMonthlyExplore,
    prePreMonthlyExplore,
    chartCore,
    chartExplore,
    selectedUnit,
    currentStartDate,
  ]);

  return { processedMetrics };
};
