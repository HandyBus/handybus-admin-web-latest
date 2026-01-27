'use client';

import { useState } from 'react';
import CustomLineChart from '@/components/chart/CustomLineChart';
import MetricCard from './MetricCard';
import DateRangeControls from './DateRangeControls';
import { MetricData, MetricId } from '../types/types';
import { useDateNavigation } from '@/app/(home)/hooks/useDateNavigation';
import { useElasticityMetricsData } from '../hooks/useElasticityMetricsData';
import dayjs from 'dayjs';

const ExploreToCoreConversionElasticity = () => {
  const {
    period,
    startDate,
    endDate,
    queryStartDate,
    queryEndDate,
    isNextDisabled,
    isPrevDisabled,
    isAllTime,
    changePeriod,
    navigatePrev,
    navigateNext,
    updateDateRange,
    setAllTimeRange,
  } = useDateNavigation({ minDate: '2025-06-06' });

  const [selectedMetricId, setSelectedMetricId] =
    useState<MetricId>('elasticityDAU');

  const { processedMetrics } = useElasticityMetricsData({
    currentStartDate: queryStartDate,
    currentEndDate: queryEndDate,
    selectedUnit: period,
  });

  const selectedMetric =
    processedMetrics.find((metric) => metric.id === selectedMetricId) ||
    processedMetrics[0];

  const handleCardClick = (id: MetricId) => {
    setSelectedMetricId(id);
    if (id === 'elasticityDAU') changePeriod('일간');
    if (id === 'elasticityWAU') changePeriod('주간');
    if (id === 'elasticityMAU') changePeriod('월간');
  };

  const getPeriodLabel = () => {
    if (isAllTime) {
      // 다른 컴포넌트들처럼 전체 기간 조회를 위한 하드코딩된 시작 날짜?
      const s = dayjs('2025-06-06').format('YYYY.MM.DD');
      const e = dayjs().subtract(1, 'day').format('YYYY.MM.DD');
      return `전체 기간 (${s} - ${e})`;
    }
    if (startDate && endDate) {
      const s = startDate.format('YYYY.MM.DD');
      const e = endDate.format('YYYY.MM.DD');
      return `${period} (${s} - ${e})`;
    }
    return `${period} (기간 선택 필요)`;
  };

  const getChartData = (metric: MetricData) => {
    return metric?.chartData || [];
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex w-full gap-16">
        {processedMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            isSelected={selectedMetricId === metric.id}
            onClick={() => handleCardClick(metric.id)}
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
          period={period}
        />
      </div>

      <div className="relative w-full overflow-hidden rounded-16 border border-basic-grey-400 bg-basic-white shadow-md">
        <div className="flex items-center justify-between p-24">
          <p className="text-20 font-600 text-basic-black">
            {selectedMetric?.chartLabel || ''}
          </p>
          <p className="text-16 font-500 text-basic-grey-600">
            {getPeriodLabel()}
          </p>
        </div>
        <div className="flex h-[530px] w-full p-24">
          <CustomLineChart
            data={selectedMetric ? getChartData(selectedMetric) : []}
            dataKey={['value']}
            label={{ value: selectedMetric?.chartLabel || '' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExploreToCoreConversionElasticity;
