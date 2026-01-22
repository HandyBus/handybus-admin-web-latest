'use client';

import { useState, useRef, useEffect } from 'react';
import CustomLineChart from '@/components/chart/CustomLineChart';
import IncreaseIcon from './icons/increase.svg';
import DecreaseIcon from './icons/decrease.svg';
import CalendarIcon from './icons/calendar.svg';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

const FILTER_PERIODS = ['전체', '월간', '주간', '일간'] as const;
type FilterPeriod = (typeof FILTER_PERIODS)[number];

type MetricId =
  | 'gmv'
  | 'activeUsersBrowse'
  | 'activeUsersParticipate'
  | 'newUsers'
  | 'newUserConversionRate'
  | 'firstPurchaseTime'
  | 'firstPaymentContribution';

interface MetricData {
  id: MetricId;
  title: string;
  subtitle?: string;
  value: string;
  unit: string;
  percentage: string;
  chartData: { date: string; value: number }[];
  chartLabel: string;
}

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

const GROWTH_METRIC_IDS: MetricId[] = [
  'gmv',
  'activeUsersBrowse',
  'activeUsersParticipate',
  'newUsers',
];

const INFLOW_METRIC_IDS: MetricId[] = [
  'newUserConversionRate',
  'firstPurchaseTime',
  'firstPaymentContribution',
];

const GrowthAndConversion = () => {
  // Growth Filter State
  const [growthPeriod, setGrowthPeriod] = useState<FilterPeriod>('전체');
  const [growthStartDate, setGrowthStartDate] = useState<Date | null>(null);
  const [growthEndDate, setGrowthEndDate] = useState<Date | null>(null);
  const [selectedGrowthMetricId, setSelectedGrowthMetricId] =
    useState<MetricId>('gmv');

  // Inflow Filter State
  const [inflowPeriod, setInflowPeriod] = useState<FilterPeriod>('전체');
  const [inflowStartDate, setInflowStartDate] = useState<Date | null>(null);
  const [inflowEndDate, setInflowEndDate] = useState<Date | null>(null);
  const [selectedInflowMetricId, setSelectedInflowMetricId] =
    useState<MetricId>('newUserConversionRate');

  const growthMetrics = METRICS.filter((metric) =>
    GROWTH_METRIC_IDS.includes(metric.id),
  );
  const inflowMetrics = METRICS.filter((metric) =>
    INFLOW_METRIC_IDS.includes(metric.id),
  );

  const selectedGrowthMetric =
    growthMetrics.find((metric) => metric.id === selectedGrowthMetricId) ||
    growthMetrics[0];

  const selectedInflowMetric =
    inflowMetrics.find((metric) => metric.id === selectedInflowMetricId) ||
    inflowMetrics[0];

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
    <div className="flex w-full min-w-[936px] flex-col gap-48">
      {/* 1. Growth Section */}
      <div className="flex flex-col gap-16">
        <AnalysisSectionHeader
          title="성장"
          selectedPeriod={growthPeriod}
          onChangePeriod={(period) => {
            setGrowthPeriod(period);
            if (period === '전체') {
              setGrowthStartDate(null);
              setGrowthEndDate(null);
            }
          }}
          startDate={growthStartDate}
          endDate={growthEndDate}
          onChangeDateRange={(start, end) => {
            setGrowthStartDate(start);
            setGrowthEndDate(end);
          }}
        />

        <div className="flex w-full gap-16">
          {growthMetrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              isSelected={selectedGrowthMetricId === metric.id}
              onClick={() => setSelectedGrowthMetricId(metric.id)}
            />
          ))}
        </div>
        <div className="relative w-full overflow-hidden rounded-16 border border-basic-grey-400 bg-basic-white shadow-md">
          <div className="flex items-center justify-between p-24">
            <p className="text-20 font-600 text-basic-black">
              {selectedGrowthMetric.chartLabel}
            </p>
            <p className="text-16 font-500 text-basic-grey-600">
              {getPeriodLabel(growthPeriod, growthStartDate, growthEndDate)}
            </p>
          </div>
          <div className="flex h-[530px] w-full p-24">
            <CustomLineChart
              data={getChartData(selectedGrowthMetric)}
              dataKey={['value']}
              label={{ value: selectedGrowthMetric.chartLabel }}
            />
          </div>
        </div>
      </div>

      {/* 2. Inflow and Conversion Section */}
      <div className="flex flex-col gap-16">
        <AnalysisSectionHeader
          title="유입과 전환"
          selectedPeriod={inflowPeriod}
          onChangePeriod={(period) => {
            setInflowPeriod(period);
            if (period === '전체') {
              setInflowStartDate(null);
              setInflowEndDate(null);
            }
          }}
          startDate={inflowStartDate}
          endDate={inflowEndDate}
          onChangeDateRange={(start, end) => {
            setInflowStartDate(start);
            setInflowEndDate(end);
          }}
        />

        <div className="flex w-full gap-16">
          {inflowMetrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              isSelected={selectedInflowMetricId === metric.id}
              onClick={() => setSelectedInflowMetricId(metric.id)}
            />
          ))}
        </div>
        <div className="relative w-full overflow-hidden rounded-16 border border-basic-grey-400 bg-basic-white shadow-md">
          <div className="flex items-center justify-between p-24">
            <p className="text-20 font-600 text-basic-black">
              {selectedInflowMetric.chartLabel}
            </p>
            <p className="text-16 font-500 text-basic-grey-600">
              {getPeriodLabel(inflowPeriod, inflowStartDate, inflowEndDate)}
            </p>
          </div>
          <div className="flex h-[530px] w-full p-24">
            <CustomLineChart
              data={getChartData(selectedInflowMetric)}
              dataKey={['value']}
              label={{ value: selectedInflowMetric.chartLabel }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface AnalysisSectionHeaderProps {
  title: string;
  selectedPeriod: FilterPeriod;
  onChangePeriod: (period: FilterPeriod) => void;
  startDate: Date | null;
  endDate: Date | null;
  onChangeDateRange: (start: Date | null, end: Date | null) => void;
}

const AnalysisSectionHeader = ({
  title,
  selectedPeriod,
  onChangePeriod,
  startDate,
  endDate,
  onChangeDateRange,
}: AnalysisSectionHeaderProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const formatDateRange = () => {
    if (!startDate || !endDate) return '모든 기간';
    const start = dayjs(startDate).format('YYYY.MM.DD');
    const end = dayjs(endDate).format('YYYY.MM.DD');
    return `${start} - ${end}`;
  };

  const currentPeriod = selectedPeriod;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  return (
    <div className="flex items-center justify-between">
      <span className="text-20 font-600 text-basic-black">{title}</span>
      <div className="flex items-center gap-16">
        <div className="relative" ref={datePickerRef}>
          <button
            type="button"
            onClick={() => {
              if (currentPeriod !== '전체') {
                setIsDatePickerOpen(!isDatePickerOpen);
              }
            }}
            disabled={currentPeriod === '전체'}
            className={`flex h-full items-center rounded-8 border border-basic-grey-200 bg-basic-white p-12 ${
              currentPeriod === '전체'
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:border-basic-grey-400'
            }`}
          >
            <div className="flex items-center gap-8">
              <CalendarIcon />
              <span
                className={`text-14 font-500 ${
                  currentPeriod === '전체'
                    ? 'text-basic-grey-400'
                    : 'text-basic-black'
                }`}
              >
                {formatDateRange()}
              </span>
            </div>
          </button>
          {isDatePickerOpen && currentPeriod !== '전체' && (
            <div className="absolute left-0 top-full z-50 mt-4">
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates as [Date | null, Date | null];
                  onChangeDateRange(start, end);
                  if (start && end) {
                    setIsDatePickerOpen(false);
                  }
                }}
                selectsRange
                startDate={startDate}
                endDate={endDate}
                inline
                className="rounded-8 border border-basic-grey-200 bg-basic-white shadow-lg"
                locale={ko}
              />
            </div>
          )}
        </div>
        <div className="h-46 flex items-start rounded-8 bg-basic-white p-4">
          {FILTER_PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => onChangePeriod(period)}
              className={`flex h-36 w-56 items-center justify-center rounded-8 text-14 font-500 ${
                currentPeriod === period
                  ? 'bg-basic-black text-basic-white'
                  : 'text-basic-grey-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  metric: MetricData;
  isSelected: boolean;
  onClick: () => void;
}

const MetricCard = ({ metric, isSelected, onClick }: MetricCardProps) => {
  const { title, subtitle, value, unit, percentage } = metric;

  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col gap-24 rounded-8 p-20 text-left transition-all
       ${
         isSelected
           ? 'bg-basic-black'
           : 'border border-basic-grey-200 bg-basic-white hover:border-basic-grey-400'
       }`}
    >
      <div className="flex items-center gap-8">
        <span
          className={`text-20 font-600 ${
            isSelected ? 'text-basic-white' : 'text-basic-black'
          }`}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className={`text-16 font-500 ${
              isSelected ? 'text-basic-grey-400' : 'text-basic-grey-600'
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex w-full items-center justify-end gap-8">
        <div className="flex items-center gap-[6px]">
          {parseFloat(percentage) < 0 ? <DecreaseIcon /> : <IncreaseIcon />}
          <span
            className={`text-16 ${parseFloat(percentage) < 0 ? 'text-basic-red-400' : 'text-brand-primary-400'}`}
          >
            {percentage}
          </span>
        </div>
        <p
          className={`text-right text-28 font-600 ${
            isSelected ? 'text-basic-white' : 'text-basic-black'
          }`}
        >
          {value}
        </p>
        <p
          className={`text-right text-16 font-500 ${
            isSelected ? 'text-basic-grey-400' : 'text-basic-grey-600'
          }`}
        >
          {unit}
        </p>
      </div>
    </button>
  );
};

export default GrowthAndConversion;
