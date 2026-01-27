'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { InfoIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

import MetricCard from '@/app/(home)/components/MetricCard';
import DateRangeControls from '@/app/(home)/components/DateRangeControls';
import CustomLineChart from '@/components/chart/CustomLineChart';
import { useDateNavigation } from '@/app/(home)/hooks/useDateNavigation';
import { useRetentionMetricsData } from '../hooks/useRetentionMetricsData';

type FandomCompetitiveness = {
  rank: number;
  artist: string;
  fandomSize: number;
  reparticipationRate: number;
  rebookingRate: number;
  rebookingCycle: number;
  reparticipationCycle: number;
  reboardingCycle: number;
  bookingGrowth: number;
  inflowMix: { existing: number; new: number };
  newInflowGrowth: number;
  crossInterest: { artist: string; percent: number };
  crossInterestDetails: { artist: string; percent: number }[];
};

const MOCK_COMPETITIVENESS_DATA: FandomCompetitiveness[] = [
  {
    rank: 1,
    artist: 'NewJeans',
    fandomSize: 45200,
    reparticipationRate: 72.3,
    rebookingRate: 45.8,
    rebookingCycle: 88,
    reparticipationCycle: 115,
    reboardingCycle: 135,
    bookingGrowth: 24.5,
    inflowMix: { existing: 62, new: 38 },
    newInflowGrowth: 42.3,
    crossInterest: { artist: 'LE SSERAFIM', percent: 15.2 },
    crossInterestDetails: [
      { artist: 'LE SSERAFIM', percent: 15.2 },
      { artist: 'IVE', percent: 8.4 },
      { artist: 'NMIXX', percent: 5.1 },
    ],
  },
  {
    rank: 2,
    artist: 'IVE',
    fandomSize: 32400,
    reparticipationRate: 68.1,
    rebookingRate: 41.2,
    rebookingCycle: 92,
    reparticipationCycle: 120,
    reboardingCycle: 140,
    bookingGrowth: -5.2,
    inflowMix: { existing: 55, new: 45 },
    newInflowGrowth: 12.8,
    crossInterest: { artist: 'aespa', percent: 12.5 },
    crossInterestDetails: [
      { artist: 'aespa', percent: 12.5 },
      { artist: 'NewJeans', percent: 9.3 },
      { artist: 'STAYC', percent: 4.2 },
    ],
  },
  {
    rank: 3,
    artist: 'aespa',
    fandomSize: 28900,
    reparticipationRate: 65.5,
    rebookingRate: 38.9,
    rebookingCycle: 95,
    reparticipationCycle: 125,
    reboardingCycle: 145,
    bookingGrowth: 15.7,
    inflowMix: { existing: 70, new: 30 },
    newInflowGrowth: -2.4,
    crossInterest: { artist: 'NMIXX', percent: 9.8 },
    crossInterestDetails: [
      { artist: 'NMIXX', percent: 9.8 },
      { artist: 'ITZY', percent: 7.5 },
      { artist: 'Red Velvet', percent: 6.1 },
    ],
  },
  {
    rank: 4,
    artist: 'LE SSERAFIM',
    fandomSize: 25600,
    reparticipationRate: 62.8,
    rebookingRate: 35.4,
    rebookingCycle: 100,
    reparticipationCycle: 130,
    reboardingCycle: 150,
    bookingGrowth: 8.4,
    inflowMix: { existing: 45, new: 55 },
    newInflowGrowth: 18.2,
    crossInterest: { artist: 'IVE', percent: 14.1 },
    crossInterestDetails: [
      { artist: 'IVE', percent: 14.1 },
      { artist: 'NewJeans', percent: 11.2 },
      { artist: 'TWICE', percent: 3.5 },
    ],
  },
  {
    rank: 5,
    artist: 'NMIXX',
    fandomSize: 18200,
    reparticipationRate: 58.2,
    rebookingRate: 32.1,
    rebookingCycle: 105,
    reparticipationCycle: 135,
    reboardingCycle: 155,
    bookingGrowth: -1.5,
    inflowMix: { existing: 80, new: 20 },
    newInflowGrowth: 5.6,
    crossInterest: { artist: 'ITZY', percent: 8.5 },
    crossInterestDetails: [
      { artist: 'ITZY', percent: 8.5 },
      { artist: 'IVE', percent: 2.2 },
      { artist: 'DAY6', percent: 1.2 },
    ],
  },
];

const RetentionFandomsDashboard = () => {
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

  const [mounted, setMounted] = useState(false);
  const [tooltipState, setTooltipState] = useState<{
    show: boolean;
    rect: DOMRect | null;
    details: { artist: string; percent: number }[];
  }>({ show: false, rect: null, details: [] });

  useEffect(() => {
    setMounted(true);
  }, []);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof FandomCompetitiveness;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: keyof FandomCompetitiveness) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'desc'
    ) {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...MOCK_COMPETITIVENESS_DATA].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    const getSortValue = (
      item: FandomCompetitiveness,
      sortKey: keyof FandomCompetitiveness,
    ): number | string => {
      if (sortKey === 'inflowMix') {
        return item.inflowMix.existing;
      }
      if (sortKey === 'crossInterest') {
        return item.crossInterest.percent;
      }
      if (sortKey === 'crossInterestDetails') {
        return 0; // Not sortable
      }
      return item[sortKey] as number | string;
    };

    const aValue = getSortValue(a, key);
    const bValue = getSortValue(b, key);

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (key: keyof FandomCompetitiveness) => {
    if (sortConfig?.key !== key) {
      return (
        <div className="ml-4 flex flex-col">
          <ArrowUpIcon size={8} className="text-basic-grey-400" />
          <ArrowDownIcon size={8} className="text-basic-grey-400" />
        </div>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUpIcon size={12} className="ml-4 inline text-basic-black" />
    ) : (
      <ArrowDownIcon size={12} className="ml-4 inline text-basic-black" />
    );
  };

  const headers: {
    label: string;
    key: keyof FandomCompetitiveness;
    width?: string;
  }[] = [
    { label: '순위', key: 'rank' },
    { label: '아티스트명', key: 'artist' },
    { label: '팬덤규모', key: 'fandomSize' },
    { label: '재참여율', key: 'reparticipationRate' },
    { label: '재참여 주기', key: 'reparticipationCycle' },
    { label: '재예매율', key: 'rebookingRate' },
    { label: '재예매 주기', key: 'rebookingCycle' },
    { label: '재탑승 주기', key: 'reboardingCycle' },
    { label: '예매 증가율', key: 'bookingGrowth' },
    { label: '유입 믹스', key: 'inflowMix', width: 'w-[200px]' },
    { label: '신규 증가율', key: 'newInflowGrowth' },
    { label: '교차 관심도', key: 'crossInterest' },
  ];

  return (
    <div className="flex w-full flex-col gap-32 pb-40">
      {/* Header Section */}
      <div className="flex flex-col gap-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-24 font-700 text-basic-black">
            리텐션 & 팬덤 통계
          </h1>
          <p className="mt-8 text-16 text-basic-grey-600">
            서비스의 재방문율과 충성 고객(팬덤)의 성장 추이를 분석합니다.
          </p>
        </div>
      </div>

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

      {/* Fandom Competitiveness Table Section */}
      <div className="flex w-full flex-col gap-16">
        <h3 className="text-20 font-600 text-basic-black">팬덤별 경쟁력</h3>
        <div className="overflow-x-auto rounded-16 border border-basic-grey-200 bg-basic-white">
          <table className="w-full min-w-[1200px] table-auto text-left">
            <thead className="bg-basic-grey-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    onClick={() => handleSort(header.key)}
                    className={`${header.width || ''} cursor-pointer whitespace-nowrap px-16 py-12 text-12 font-500 text-basic-grey-600 hover:bg-basic-grey-50`}
                  >
                    <div
                      className={`flex items-center ${header.key === 'inflowMix' ? 'w-full justify-between' : 'gap-4'}`}
                    >
                      <div className="flex items-center gap-4">
                        {header.label}
                        {renderSortIcon(header.key)}
                      </div>
                      {header.key === 'inflowMix' ? (
                        <div className="font-normal flex items-center gap-4 text-10">
                          <span className="flex items-center gap-4">
                            <div className="h-[6px] w-[6px] rounded-full bg-[#3B82F6]"></div>
                            <span className="text-basic-grey-600">기존</span>
                          </span>
                          <span className="flex items-center gap-4">
                            <div className="h-[6px] w-[6px] rounded-full bg-[#A855F7]"></div>
                            <span className="text-basic-grey-600">신규</span>
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-basic-grey-200">
              {sortedData.map((row, index) => (
                <tr key={index} className="hover:bg-basic-grey-50">
                  <td className="px-16 py-20 text-14 text-basic-grey-600">
                    {String(row.rank).padStart(3, '0')}
                  </td>
                  <td className="px-16 py-20 text-14 font-600 text-basic-black">
                    {row.artist}
                  </td>
                  <td className="px-16 py-20 text-14 text-basic-grey-600">
                    {row.fandomSize.toLocaleString()}
                  </td>
                  <td className="px-16 py-20 text-14 font-600 text-[#3B82F6]">
                    {row.reparticipationRate}%
                  </td>
                  <td className="px-16 py-20 text-14 text-basic-grey-600">
                    {row.reparticipationCycle}일
                  </td>
                  <td className="px-16 py-20 text-14 font-600 text-[#A855F7]">
                    {row.rebookingRate}%
                  </td>
                  <td className="px-16 py-20 text-14 text-basic-grey-600">
                    {row.rebookingCycle}일
                  </td>
                  <td className="px-16 py-20 text-14 text-basic-grey-600">
                    {row.reboardingCycle}일
                  </td>
                  <td
                    className={`px-16 py-20 text-14 font-600 ${row.bookingGrowth > 0 ? 'text-[#22C55E]' : 'text-basic-red-500'}`}
                  >
                    {row.bookingGrowth > 0 ? '+' : ''}
                    {row.bookingGrowth}%
                  </td>
                  <td className="px-16 py-20">
                    <div className="flex h-8 w-full overflow-hidden rounded-full bg-basic-grey-100">
                      <div
                        className="h-full bg-[#3B82F6]"
                        style={{ width: `${row.inflowMix.existing}%` }}
                      ></div>
                      <div
                        className="h-full bg-[#A855F7]"
                        style={{ width: `${row.inflowMix.new}%` }}
                      ></div>
                    </div>
                    <div className="mt-4 flex justify-between text-10 text-basic-grey-500">
                      <span>{row.inflowMix.existing}%</span>
                      <span>{row.inflowMix.new}%</span>
                    </div>
                  </td>
                  <td
                    className={`px-16 py-20 text-14 font-600 ${row.newInflowGrowth > 0 ? 'text-[#22C55E]' : 'text-basic-red-500'}`}
                  >
                    {row.newInflowGrowth > 0 ? '+' : ''}
                    {row.newInflowGrowth}%
                  </td>
                  <td className="px-16 py-20 text-14 font-600 text-basic-black">
                    <div
                      className="flex cursor-help items-center gap-4"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipState({
                          show: true,
                          rect,
                          details: row.crossInterestDetails,
                        });
                      }}
                      onMouseLeave={() =>
                        setTooltipState((prev) => ({ ...prev, show: false }))
                      }
                    >
                      {row.crossInterest.artist}
                      <span className="text-[#3B82F6]">
                        {row.crossInterest.percent}%
                      </span>
                      <InfoIcon size={14} className="text-basic-grey-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Portal Tooltip */}
      {mounted &&
        tooltipState.show &&
        tooltipState.rect &&
        createPortal(
          <div
            className="pointer-events-none fixed z-50 flex w-[180px] flex-col gap-8 rounded-8 border border-basic-grey-200 bg-basic-white p-12 shadow-md"
            style={{
              top: tooltipState.rect.top - 8,
              left: tooltipState.rect.right,
              transform: 'translateX(-100%) translateY(-100%)',
            }}
          >
            <span className="text-12 font-600 text-basic-grey-600">
              교차 관심 아티스트
            </span>
            <div className="flex flex-col gap-4">
              {tooltipState.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-12"
                >
                  <span className="text-basic-black">{detail.artist}</span>
                  <span className="text-[#3B82F6]">{detail.percent}%</span>
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default RetentionFandomsDashboard;
