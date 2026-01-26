'use client';

import { useState } from 'react';
import CustomLineChart from '@/components/chart/CustomLineChart';
import MetricCard from './MetricCard';
import MetricUnitFilter from './MetricUnitFilter';
import DateRangeControls from './DateRangeControls';
import Heading from '@/components/text/Heading';
import { MetricData, MetricId, FilterPeriod } from '../types/types';
import { useDateNavigation } from '@/app/(home)/hooks/useDateNavigation';
import dayjs from 'dayjs';

const METRICS: MetricData[] = [
  {
    id: 'newUserConversionRate',
    title: '신규 유저 구매전환율',
    value: '24.8',
    unit: '%',
    percentage: '15.3%',
    chartData: [
      { date: '1월', value: 20 },
      { date: '2월', value: 22 },
      { date: '3월', value: 21 },
      { date: '4월', value: 23 },
      { date: '5월', value: 24 },
      { date: '6월', value: 23.5 },
      { date: '7월', value: 25 },
      { date: '8월', value: 24.5 },
      { date: '9월', value: 26 },
      { date: '10월', value: 25.5 },
      { date: '11월', value: 27 },
      { date: '12월', value: 28 },
    ],
    chartLabel: '신규 유저 구매전환율',
  },
  {
    id: 'firstPurchaseTime',
    title: '첫 구매 소요 시간',
    subtitle: '평균',
    value: '3.2',
    unit: '일',
    percentage: '15.3%',
    chartData: [
      { date: '1월', value: 4 },
      { date: '2월', value: 3.5 },
      { date: '3월', value: 3.8 },
      { date: '4월', value: 3.2 },
      { date: '5월', value: 3 },
      { date: '6월', value: 3.3 },
      { date: '7월', value: 2.8 },
      { date: '8월', value: 3.1 },
      { date: '9월', value: 2.5 },
      { date: '10월', value: 2.9 },
      { date: '11월', value: 2.3 },
      { date: '12월', value: 2.1 },
    ],
    chartLabel: '첫 구매 소요 시간',
  },
  {
    id: 'firstPaymentContribution',
    title: '첫 결제 매출기여도',
    value: '23.1',
    unit: '%',
    percentage: '15.3%',
    chartData: [
      { date: '1월', value: 18 },
      { date: '2월', value: 20 },
      { date: '3월', value: 19 },
      { date: '4월', value: 21 },
      { date: '5월', value: 22 },
      { date: '6월', value: 21.5 },
      { date: '7월', value: 23 },
      { date: '8월', value: 22.5 },
      { date: '9월', value: 24 },
      { date: '10월', value: 23.5 },
      { date: '11월', value: 25 },
      { date: '12월', value: 26 },
    ],
    chartLabel: '첫 결제 매출기여도',
  },
];

const INFLOW_METRIC_IDS: MetricId[] = [
  'newUserConversionRate',
  'firstPurchaseTime',
  'firstPaymentContribution',
];

const InflowAndConversionMetrics = () => {
  const {
    period,
    startDate,
    endDate,
    isNextDisabled,
    isPrevDisabled,
    isAllTime,
    changePeriod,
    navigatePrev,
    navigateNext,
    updateDateRange,
    setAllTimeRange,
  } = useDateNavigation();

  const [selectedMetricId, setSelectedMetricId] = useState<MetricId>(
    'newUserConversionRate',
  );

  /* static METRICS are defined outside. I will map them inside component to add the dynamic label */

  // Helper to get label
  const getCriterionLabel = (p: FilterPeriod) => {
    if (p === '일간') return '전 일 기준';
    if (p === '주간') return '전 주 기준';
    return '전 달 기준';
  };

  const metrics = METRICS.filter((metric) =>
    INFLOW_METRIC_IDS.includes(metric.id),
  ).map((m) => ({
    ...m,
    criterionLabel: getCriterionLabel(period),
  }));

  const selectedMetric =
    metrics.find((metric) => metric.id === selectedMetricId) || metrics[0];

  const getChartData = (metric: MetricData) => {
    return metric.chartData;
  };

  const getPeriodLabel = () => {
    if (isAllTime) {
      const s = dayjs('2025-02-12').format('YYYY.MM.DD');
      const e = dayjs().format('YYYY.MM.DD');
      return `전체 기간 (${s} - ${e})`;
    }
    if (startDate && endDate) {
      const s = startDate.format('YYYY.MM.DD');
      const e = endDate.format('YYYY.MM.DD');
      return `${period} (${s} - ${e})`;
    }
    return `${period} (기간 선택 필요)`;
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center justify-between">
        <Heading.h2>유입과 전환</Heading.h2>
        <MetricUnitFilter
          selectedPeriod={period}
          onChangePeriod={changePeriod}
        />
      </div>

      <div className="flex w-full gap-16">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            isSelected={selectedMetricId === metric.id}
            onClick={() => setSelectedMetricId(metric.id)}
          />
        ))}
      </div>

      <div className="flex w-full justify-end">
        <DateRangeControls
          startDate={startDate}
          endDate={endDate}
          onPrevClick={navigatePrev}
          onNextClick={navigateNext}
          onDateRangeChange={updateDateRange}
          onAllTimeClick={setAllTimeRange}
          isAllTime={isAllTime}
          isPrevDisabled={isPrevDisabled}
          isNextDisabled={isNextDisabled}
        />
      </div>

      <div className="relative w-full overflow-hidden rounded-16 border border-basic-grey-400 bg-basic-white shadow-md">
        <div className="flex items-center justify-between p-24">
          <p className="text-20 font-600 text-basic-black">
            {selectedMetric.chartLabel}
          </p>
          <p className="text-16 font-500 text-basic-grey-600">
            {getPeriodLabel()}
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

export default InflowAndConversionMetrics;
