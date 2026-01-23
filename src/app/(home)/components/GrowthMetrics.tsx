import { useState } from 'react';
import CustomLineChart from '@/components/chart/CustomLineChart';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import MetricCard from './MetricCard';
import MetricUnitFilter from './MetricUnitFilter';
import DateRangeControls from './DateRangeControls';
import Heading from '@/components/text/Heading';
import { MetricData, MetricId } from '../types/types';
import { useDateNavigation } from '@/app/(home)/hooks/useDateNavigation';
import { useGrowthMetricsData } from '../hooks/useGrowthMetricsData';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekOfYear);

const GrowthMetrics = () => {
  const [selectedMetricId, setSelectedMetricId] = useState<MetricId>('gmv');

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
  } = useDateNavigation();

  const { processedMetrics } = useGrowthMetricsData({
    currentStartDate: queryStartDate,
    currentEndDate: queryEndDate,
    period,
  });

  const selectedMetric =
    processedMetrics.find((metric) => metric.id === selectedMetricId) ||
    processedMetrics[0];

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
        <Heading.h2>성장</Heading.h2>
        <MetricUnitFilter
          selectedPeriod={period}
          onChangePeriod={changePeriod}
        />
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

export default GrowthMetrics;
