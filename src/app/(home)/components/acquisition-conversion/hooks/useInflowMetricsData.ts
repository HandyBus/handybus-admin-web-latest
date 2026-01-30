import { useMemo } from 'react';
import {
  getDailySignupMetrics,
  getDailyFirstPurchaseLeadTimeMetrics,
  getDailyGmvMetrics,
} from '@/services/analytics.service';
import {
  DailySignupMetricsViewEntity,
  DailyFirstPurchaseLeadTimeMetricsReadModel,
  DailyGmvMetricsViewEntity,
} from '@/types/analytics.type';
import { useComparisonQuery } from '@/app/(home)/hooks/useComparisonQuery';
import { MetricData } from '@/app/(home)/types/types';
import { processChartData } from '@/app/(home)/utils/chartData.util';
import { calculatePercentage } from '@/app/(home)/utils/metrics.util';
import { getLatestDataDate } from '@/app/(home)/utils/dateNavigation.util';

interface UseInflowMetricsDataProps {
  currentStartDate: string;
  currentEndDate: string;
}

export const useInflowMetricsData = ({
  currentStartDate,
  currentEndDate,
}: UseInflowMetricsDataProps) => {
  // --- 1. 날짜 계산 로직 (카드용 - 최근 기간) ---
  // 유입과 전환은 항상 "일간" 기준입니다.
  // 카드에는 "어제(최근 완료된 날)" vs "그제(비교 대상)" 데이터를 보여줍니다.
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

  // --- 2. Chart Data Fetching (Chart는 선택된 기간의 데이터를 일별로 보여줌) ---
  const { currentData: chartSignupData } = useComparisonQuery({
    queryKey: ['daily-signup-metrics-chart-inflow'],
    fetcher: getDailySignupMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: true,
  });

  const { currentData: chartLeadTimeData } = useComparisonQuery({
    queryKey: ['daily-lead-time-metrics-chart-inflow'],
    fetcher: getDailyFirstPurchaseLeadTimeMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: true,
  });

  const { currentData: chartGmvData } = useComparisonQuery({
    queryKey: ['daily-gmv-metrics-chart-inflow'],
    fetcher: getDailyGmvMetrics,
    currentStartDate,
    currentEndDate,
    prevStartDate: '',
    prevEndDate: '',
    enabled: true,
  });

  // --- 3. Card Data Fetching (Card는 최근 일자(어제) 기준) ---
  const { currentData: cardSignupData, prevData: cardPreSignupData } =
    useComparisonQuery({
      queryKey: ['daily-signup-metrics-card-inflow', cardRecentStartDate],
      fetcher: getDailySignupMetrics,
      currentStartDate: cardRecentStartDate,
      currentEndDate: cardRecentEndDate,
      prevStartDate: cardPreStartDate,
      prevEndDate: cardPreEndDate,
      enabled: true,
    });

  const { currentData: cardLeadTimeData, prevData: cardPreLeadTimeData } =
    useComparisonQuery({
      queryKey: ['daily-lead-time-metrics-card-inflow', cardRecentStartDate],
      fetcher: getDailyFirstPurchaseLeadTimeMetrics,
      currentStartDate: cardRecentStartDate,
      currentEndDate: cardRecentEndDate,
      prevStartDate: cardPreStartDate,
      prevEndDate: cardPreEndDate,
      enabled: true,
    });

  const { currentData: cardGmvData, prevData: cardPreGmvData } =
    useComparisonQuery({
      queryKey: ['daily-gmv-metrics-card-inflow', cardRecentStartDate],
      fetcher: getDailyGmvMetrics,
      currentStartDate: cardRecentStartDate,
      currentEndDate: cardRecentEndDate,
      prevStartDate: cardPreStartDate,
      prevEndDate: cardPreEndDate,
      enabled: true,
    });

  // --- 4. 데이터 통합 및 가공 ---

  const processedMetrics: MetricData[] = useMemo(() => {
    const metrics: MetricData[] = [];

    // 1. 신규 유저 구매전환율
    // 정의: firstPurchaseOnSignupDayUserCount / newUserCount
    // Card Value: 어제 Conversion Rate
    const lastSignup = cardSignupData?.[0]; // 일간이므로 1개만 옴
    const lastPreSignup = cardPreSignupData?.[0];

    const currentConversionRate =
      lastSignup && lastSignup.newUserCount > 0
        ? (lastSignup.firstPurchaseOnSignupDayUserCount /
            lastSignup.newUserCount) *
          100
        : 0;

    const prevConversionRate =
      lastPreSignup && lastPreSignup.newUserCount > 0
        ? (lastPreSignup.firstPurchaseOnSignupDayUserCount /
            lastPreSignup.newUserCount) *
          100
        : 0;

    // Chart Data
    const conversionRawData = chartSignupData?.map(
      (d: DailySignupMetricsViewEntity) => ({
        date: d.date,
        value:
          d.newUserCount > 0
            ? (d.firstPurchaseOnSignupDayUserCount / d.newUserCount) * 100
            : 0,
      }),
    );
    const conversionChartData = processChartData(conversionRawData, '일간');

    metrics.push({
      id: 'newUserConversionRate',
      title: '신규 유저 구매전환율',
      value: currentConversionRate.toFixed(1),
      unit: '%',
      percentage: calculatePercentage(
        currentConversionRate,
        prevConversionRate,
      ),
      criterionLabel,
      chartData: conversionChartData,
      chartLabel: '신규 유저 구매전환율',
    });

    // 2. 첫 구매 소요시간
    // 정의: averageUserTimeToFirstPurchaseHours
    const lastLeadTime = cardLeadTimeData?.[0];
    const lastPreLeadTime = cardPreLeadTimeData?.[0];

    const currentLeadTime =
      lastLeadTime?.averageUserTimeToFirstPurchaseHours || 0;
    const prevLeadTime =
      lastPreLeadTime?.averageUserTimeToFirstPurchaseHours || 0;

    const leadTimeRawData = chartLeadTimeData?.map(
      (d: DailyFirstPurchaseLeadTimeMetricsReadModel) => ({
        date: d.date,
        value: d.averageUserTimeToFirstPurchaseHours,
      }),
    );
    const leadTimeChartData = processChartData(leadTimeRawData, '일간');

    metrics.push({
      id: 'firstPurchaseTime',
      title: '첫 구매 소요 시간',
      subtitle: '평균',
      value: currentLeadTime.toFixed(1),
      unit: '시간',
      percentage: calculatePercentage(currentLeadTime, prevLeadTime),
      criterionLabel,
      chartData: leadTimeChartData,
      chartLabel: '첫 구매 소요 시간',
    });

    // 3. 첫 결제 매출기여도
    // 정의: firstPurchaseGmvAmount / gmvAmount
    const lastGmv = cardGmvData?.[0];
    const lastPreGmv = cardPreGmvData?.[0];

    const currentContribution =
      lastGmv && lastGmv.gmvAmount > 0
        ? (lastGmv.firstPurchaseGmvAmount / lastGmv.gmvAmount) * 100
        : 0;

    const prevContribution =
      lastPreGmv && lastPreGmv.gmvAmount > 0
        ? (lastPreGmv.firstPurchaseGmvAmount / lastPreGmv.gmvAmount) * 100
        : 0;

    const contributionRawData = chartGmvData?.map(
      (d: DailyGmvMetricsViewEntity) => ({
        date: d.date,
        value:
          d.gmvAmount > 0 ? (d.firstPurchaseGmvAmount / d.gmvAmount) * 100 : 0,
      }),
    );
    const contributionChartData = processChartData(contributionRawData, '일간');

    metrics.push({
      id: 'firstPaymentContribution',
      title: '첫 결제 매출기여도',
      value: currentContribution.toFixed(1),
      unit: '%',
      percentage: calculatePercentage(currentContribution, prevContribution),
      criterionLabel,
      chartData: contributionChartData,
      chartLabel: '첫 결제 매출기여도',
    });

    return metrics;
  }, [
    criterionLabel,
    cardSignupData,
    cardPreSignupData,
    chartSignupData,
    cardLeadTimeData,
    cardPreLeadTimeData,
    chartLeadTimeData,
    cardGmvData,
    cardPreGmvData,
    chartGmvData,
  ]);

  return { processedMetrics };
};
