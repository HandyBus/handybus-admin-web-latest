import { useMemo, useState } from 'react';
import CustomLineChart from '@/components/chart/CustomLineChart';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import {
  useGetDailyGmvMetrics,
  useGetDailySignupMetrics,
} from '@/services/analytics.service';
import AnalysisSectionHeader from './AnalysisSectionHeader';
import MetricCard from './MetricCard';
import { MetricData, MetricId, FilterPeriod } from '../types/types';
import { METRICS } from '../constants/growthMetrics.constant';
import { processChartData } from '../utils/chartData.util';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekOfYear);

const GrowthMetrics = () => {
  const [period, setPeriod] = useState<FilterPeriod>('전체');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedMetricId, setSelectedMetricId] = useState<MetricId>('gmv');

  /*
   * 날짜 및 기간 로직 업데이트:
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
        return '2025-02-12'; // Start date for "전체"
      case '월간':
        return today
          .subtract(5, 'month') // 최근 6개월
          .startOf('month')
          .format('YYYY-MM-DD');
      case '주간':
        return today.subtract(11, 'week').startOf('week').format('YYYY-MM-DD'); // 최근 12주
      case '일간':
        return today.subtract(29, 'day').format('YYYY-MM-DD'); // 최근 30일
      default:
        return '2025-02-12';
    }
  }, [period, startDate]);

  const queryEndDate = useMemo(() => {
    if (endDate) return endDate.format('YYYY-MM-DD');
    return dayjs().format('YYYY-MM-DD');
  }, [endDate]);

  const { data: gmvData } = useGetDailyGmvMetrics({
    startDate: queryStartDate,
    endDate: queryEndDate,
  });

  const { data: signupData } = useGetDailySignupMetrics({
    startDate: queryStartDate,
    endDate: queryEndDate,
  });

  const processedMetrics: MetricData[] = useMemo(() => {
    const metrics: MetricData[] = [];

    // 활성 사용자 (Explore) - 모킹 데이터
    metrics.push(
      METRICS.find((m) => m.id === 'activeUsersExplore') || METRICS[0],
    );

    // 활성 사용자 (Core) - 모킹 데이터
    metrics.push(METRICS.find((m) => m.id === 'activeUsersCore') || METRICS[1]);

    // 신규 가입자
    const totalNewUsers =
      signupData?.reduce((acc, curr) => acc + curr.newUserCount, 0) || 0;

    const newUserRawData = signupData?.map((d) => ({
      date: d.date,
      value: d.newUserCount,
    }));
    const newUsersChartData = processChartData(newUserRawData, period);

    metrics.push({
      id: 'newUsers',
      title: '신규 가입자 수',
      value: totalNewUsers.toLocaleString(),
      unit: '명',
      percentage: '-',
      chartData: newUsersChartData,
      chartLabel: '신규 가입자 수',
    });

    // GMV (총 거래액)
    const totalGmv =
      gmvData?.reduce((acc, curr) => acc + curr.gmvAmount, 0) || 0;

    const gmvRawData = gmvData?.map((d) => ({
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
      percentage: '-',
      chartData: gmvChartData,
      chartLabel: 'GMV',
    });

    return metrics;
  }, [gmvData, signupData, period]);

  const selectedMetric =
    processedMetrics.find((metric) => metric.id === selectedMetricId) ||
    processedMetrics[0];

  const getChartData = (metric: MetricData) => {
    return metric.chartData;
  };

  const getPeriodLabel = (
    currentPeriodItem: FilterPeriod,
    start: Dayjs | null,
    end: Dayjs | null,
  ) => {
    if (currentPeriodItem === '전체') {
      const s = dayjs('2025-02-12').format('YYYY.MM.DD');
      const e = dayjs().format('YYYY.MM.DD');
      return `전체 기간 (${s} - ${e})`;
    }
    if (start && end) {
      const s = start.format('YYYY.MM.DD');
      const e = end.format('YYYY.MM.DD');
      return `${currentPeriodItem} (${s} - ${e})`;
    }
    return `${currentPeriodItem} (기간 선택 필요)`;
  };

  const handleOnChangePeriod = (p: FilterPeriod) => {
    setPeriod(p);
    const today = dayjs();
    if (p === '전체') {
      setStartDate(null);
      setEndDate(null);
    } else if (p === '월간') {
      setStartDate(today.subtract(5, 'month').startOf('month'));
      setEndDate(today);
    } else if (p === '주간') {
      setStartDate(today.subtract(11, 'week').startOf('week'));
      setEndDate(today);
    } else if (p === '일간') {
      setStartDate(today.subtract(29, 'day'));
      setEndDate(today);
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <AnalysisSectionHeader
        title="성장"
        selectedPeriod={period}
        onChangePeriod={handleOnChangePeriod}
        startDate={startDate}
        endDate={endDate}
        onChangeDateRange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />

      <div className="flex w-full gap-16">
        {processedMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            isSelected={selectedMetricId === metric.id}
            onClick={() => setSelectedMetricId(metric.id)}
          />
        ))}
      </div>
      <div className="relative w-full overflow-hidden rounded-16 border border-basic-grey-400 bg-basic-white shadow-md">
        <div className="flex items-center justify-between p-24">
          <p className="text-20 font-600 text-basic-black">
            {selectedMetric.chartLabel}
          </p>
          <p className="text-16 font-500 text-basic-grey-600">
            {getPeriodLabel(period, startDate, endDate)}
          </p>
        </div>
        <div className="flex h-[530px] w-full p-24">
          <CustomLineChart
            data={getChartData(selectedMetric)}
            dataKey={['value']}
            label={{ value: selectedMetric.chartLabel }}
          />
        </div>
      </div>
    </div>
  );
};

export default GrowthMetrics;
