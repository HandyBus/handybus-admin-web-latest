'use client';

import { useState } from 'react';
import CustomLineChart from '@/components/chart/CustomLineChart';
import MetricCard from './MetricCard';
import DateRangeControls from './DateRangeControls';
import Heading from '@/components/text/Heading';
import { MetricData, MetricId } from '../types/types';
import { useDateNavigation } from '@/app/(home)/hooks/useDateNavigation';
import dayjs from 'dayjs';
import { useInflowMetricsData } from '../hooks/useInflowMetricsData';

const InflowAndConversionMetrics = () => {
  const {
    period,
    startDate,
    endDate,
    queryStartDate,
    queryEndDate,
    isNextDisabled,
    isPrevDisabled,
    isAllTime,
    navigatePrev,
    navigateNext,
    updateDateRange,
    setAllTimeRange,
  } = useDateNavigation();

  const [selectedMetricId, setSelectedMetricId] = useState<MetricId>(
    'newUserConversionRate',
  );

  const { processedMetrics } = useInflowMetricsData({
    currentStartDate: queryStartDate,
    currentEndDate: queryEndDate,
  });

  const selectedMetric =
    processedMetrics.find((metric) => metric.id === selectedMetricId) ||
    processedMetrics[0];

  const getChartData = (metric: MetricData) => {
    return metric?.chartData || [];
  };

  const getPeriodLabel = () => {
    if (isAllTime) {
      const s = dayjs('2025-02-12').format('YYYY.MM.DD');
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

  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center justify-between">
        <Heading.h2>유입과 전환</Heading.h2>
      </div>

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

export default InflowAndConversionMetrics;
