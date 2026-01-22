'use client';

import { useState } from 'react';
import CustomLineChart from '@/components/chart/CustomLineChart';
import dayjs from 'dayjs';
import AnalysisSectionHeader from './AnalysisSectionHeader';
import MetricCard from './MetricCard';
import { MetricData, MetricId, FilterPeriod } from '../types/types';

const METRICS: MetricData[] = [
  {
    id: 'gmv',
    title: 'GMV',
    subtitle: '매출',
    value: '280만',
    unit: '원',
    percentage: '15.3%',
    chartData: [
      { date: '1월', value: 200 },
      { date: '2월', value: 250 },
      { date: '3월', value: 220 },
      { date: '4월', value: 280 },
      { date: '5월', value: 300 },
      { date: '6월', value: 290 },
      { date: '7월', value: 320 },
      { date: '8월', value: 310 },
      { date: '9월', value: 350 },
      { date: '10월', value: 340 },
      { date: '11월', value: 380 },
      { date: '12월', value: 400 },
    ],
    chartLabel: 'GMV',
  },
  {
    id: 'activeUsersBrowse',
    title: '활성유저',
    subtitle: '탐색',
    value: '85.7K',
    unit: '명',
    percentage: '15.3%',
    chartData: [
      { date: '1월', value: 30 },
      { date: '2월', value: 45 },
      { date: '3월', value: 35 },
      { date: '4월', value: 50 },
      { date: '5월', value: 60 },
      { date: '6월', value: 55 },
      { date: '7월', value: 70 },
      { date: '8월', value: 65 },
      { date: '9월', value: 80 },
      { date: '10월', value: 75 },
      { date: '11월', value: 90 },
      { date: '12월', value: 100 },
    ],
    chartLabel: '활성유저 (탐색)',
  },
  {
    id: 'activeUsersParticipate',
    title: '활성유저',
    subtitle: '참여',
    value: '280만',
    unit: '원',
    percentage: '15.3%',
    chartData: [
      { date: '1월', value: 25 },
      { date: '2월', value: 40 },
      { date: '3월', value: 30 },
      { date: '4월', value: 45 },
      { date: '5월', value: 55 },
      { date: '6월', value: 50 },
      { date: '7월', value: 65 },
      { date: '8월', value: 60 },
      { date: '9월', value: 75 },
      { date: '10월', value: 70 },
      { date: '11월', value: 85 },
      { date: '12월', value: 95 },
    ],
    chartLabel: '활성유저 (참여)',
  },
  {
    id: 'newUsers',
    title: '신규 유저',
    value: '5K',
    unit: '명',
    percentage: '15.3%',
    chartData: [
      { date: '1월', value: 3 },
      { date: '2월', value: 4 },
      { date: '3월', value: 3.5 },
      { date: '4월', value: 4.5 },
      { date: '5월', value: 5 },
      { date: '6월', value: 4.8 },
      { date: '7월', value: 5.5 },
      { date: '8월', value: 5.2 },
      { date: '9월', value: 6 },
      { date: '10월', value: 5.8 },
      { date: '11월', value: 6.5 },
      { date: '12월', value: 7 },
    ],
    chartLabel: '신규 유저',
  },
];

const GROWTH_METRIC_IDS: MetricId[] = [
  'gmv',
  'activeUsersBrowse',
  'activeUsersParticipate',
  'newUsers',
];

const GrowthMetrics = () => {
  const [period, setPeriod] = useState<FilterPeriod>('전체');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedMetricId, setSelectedMetricId] = useState<MetricId>('gmv');

  const metrics = METRICS.filter((metric) =>
    GROWTH_METRIC_IDS.includes(metric.id),
  );

  const selectedMetric =
    metrics.find((metric) => metric.id === selectedMetricId) || metrics[0];

  const getChartData = (metric: MetricData) => {
    return metric.chartData;
  };

  const getPeriodLabel = (
    period: FilterPeriod,
    start: Date | null,
    end: Date | null,
  ) => {
    if (period === '전체') {
      return '전체 기간 (1월 - 12월)';
    }
    if (start && end) {
      const s = dayjs(start).format('YYYY.MM.DD');
      const e = dayjs(end).format('YYYY.MM.DD');
      return `${period} (${s} - ${e})`;
    }
    return `${period} (기간 선택 필요)`;
  };

  return (
    <div className="flex flex-col gap-16">
      <AnalysisSectionHeader
        title="성장"
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

export default GrowthMetrics;
