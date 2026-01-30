'use client';

import { useState } from 'react';
import MetricCard from '@/app/(home)/components/MetricCard';
import DateRangeControls from '@/app/(home)/components/DateRangeControls';
import CustomLineChart from '@/components/chart/CustomLineChart';
import { useDateNavigation } from '@/app/(home)/hooks/useDateNavigation';
import { useRetentionMetricsData } from '../hooks/useRetentionMetricsData';
import Heading from '@/components/text/Heading';

const RetentionLoyaltySection = () => {
  const [selectedMetricId, setSelectedMetricId] = useState<string>(
    'reparticipation_rate',
  );

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

  const { processedMetrics } = useRetentionMetricsData({
    currentStartDate: queryStartDate,
    currentEndDate: queryEndDate,
  });

  const selectedMetric =
    processedMetrics.find((m) => m.id === selectedMetricId) ||
    processedMetrics[0];

  return (
    <div className="flex w-full flex-col gap-32">
      <Heading.h2>반복 이용과 충성도</Heading.h2>
      {/* Cards Grid */}
      <div className="flex flex-col gap-16">
        {/* Row 1: 2 items */}
        <div className="grid grid-cols-2 gap-16">
          {[
            processedMetrics.find((m) => m.id === 'reparticipation_rate'),
            processedMetrics.find((m) => m.id === 'rebooking_rate'),
          ]
            .filter(Boolean)
            .map((item) => (
              <MetricCard
                key={item!.id}
                metric={item!}
                isSelected={selectedMetricId === item!.id}
                onClick={() => setSelectedMetricId(item!.id)}
              />
            ))}
        </div>
        {/* Row 2: 3 items */}
        <div className="grid grid-cols-3 gap-16">
          {[
            processedMetrics.find((m) => m.id === 'reparticipation_cycle'),
            processedMetrics.find((m) => m.id === 'rebooking_cycle'),
            processedMetrics.find((m) => m.id === 'reboarding_cycle'),
          ]
            .filter(Boolean)
            .map((item) => (
              <MetricCard
                key={item!.id}
                metric={item!}
                isSelected={selectedMetricId === item!.id}
                onClick={() => setSelectedMetricId(item!.id)}
              />
            ))}
        </div>
      </div>

      {/* Date Controls */}
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

      {/* Chart Section */}
      <div className="flex w-full flex-col gap-24 rounded-24 border border-basic-grey-200 bg-basic-white shadow-md">
        <div className="flex items-center justify-between p-24 pb-0">
          <p className="text-20 font-600 text-basic-black">
            {selectedMetric?.chartLabel || ''} 추이
          </p>
        </div>

        <div className="flex h-[530px] w-full p-24 pt-0">
          <CustomLineChart
            data={selectedMetric?.chartData || []}
            dataKey={['value']}
            label={{ value: selectedMetric?.chartLabel || '' }}
          />
        </div>
      </div>
    </div>
  );
};

export default RetentionLoyaltySection;
