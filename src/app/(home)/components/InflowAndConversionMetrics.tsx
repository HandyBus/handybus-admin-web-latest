'use client';

import { useState } from 'react';
import CustomLineChart from '@/components/chart/CustomLineChart';
import { Dayjs } from 'dayjs';
import AnalysisSectionHeader from './AnalysisSectionHeader';
import MetricCard from './MetricCard';
import { MetricData, MetricId, FilterPeriod } from '../types/types';

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
  const [period, setPeriod] = useState<FilterPeriod>('전체');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedMetricId, setSelectedMetricId] = useState<MetricId>(
    'newUserConversionRate',
  );

  const metrics = METRICS.filter((metric) =>
    INFLOW_METRIC_IDS.includes(metric.id),
  );

  const selectedMetric =
    metrics.find((metric) => metric.id === selectedMetricId) || metrics[0];

  const getChartData = (metric: MetricData) => {
    return metric.chartData;
  };

  const getPeriodLabel = (
    period: FilterPeriod,
    start: Dayjs | null,
    end: Dayjs | null,
  ) => {
    if (period === '전체') {
      return '전체 기간 (1월 - 12월)';
    }
    if (start && end) {
      const s = start.format('YYYY.MM.DD');
      const e = end.format('YYYY.MM.DD');
      return `${period} (${s} - ${e})`;
    }
    return `${period} (기간 선택 필요)`;
  };

  return (
    <div className="flex flex-col gap-16">
      <AnalysisSectionHeader
        title="유입과 전환"
        selectedPeriod={period}
        onChangePeriod={(p) => {
          setPeriod(p);
          if (p === '전체') {
            setStartDate(null);
            setEndDate(null);
          }
        }}
        startDate={startDate}
        endDate={endDate}
        onChangeDateRange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />

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

export default InflowAndConversionMetrics;
