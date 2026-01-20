'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { createPortal } from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import {
  CalendarIcon,
  RotateCcwIcon,
  InfoIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from 'lucide-react';
import Button from '@/components/button/Button';

type ChartDataPoint = {
  name: string;
  value: number;
};

type Metric = {
  id: string;
  title: string;
  value: string;
  chartData: ChartDataPoint[];
};

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

const MOCK_DATA: Metric[] = [
  {
    id: 'reparticipation_rate',
    title: '행사 재참여율',
    value: '78.5%',
    chartData: [
      { name: '1월', value: 65 },
      { name: '2월', value: 68 },
      { name: '3월', value: 72 },
      { name: '4월', value: 70 },
      { name: '5월', value: 75 },
      { name: '6월', value: 78.5 },
    ],
  },
  {
    id: 'rebooking_rate',
    title: '행사 재예매율',
    value: '42.1%',
    chartData: [
      { name: '1월', value: 35 },
      { name: '2월', value: 38 },
      { name: '3월', value: 40 },
      { name: '4월', value: 41 },
      { name: '5월', value: 41.5 },
      { name: '6월', value: 42.1 },
    ],
  },
  {
    id: 'reparticipation_cycle',
    title: '행사 재참여주기',
    value: '45일',
    chartData: [
      { name: '1월', value: 55 },
      { name: '2월', value: 52 },
      { name: '3월', value: 50 },
      { name: '4월', value: 48 },
      { name: '5월', value: 46 },
      { name: '6월', value: 45 },
    ],
  },
  {
    id: 'rebooking_cycle',
    title: '행사 재예매주기',
    value: '15일',
    chartData: [
      { name: '1월', value: 20 },
      { name: '2월', value: 19 },
      { name: '3월', value: 18 },
      { name: '4월', value: 17 },
      { name: '5월', value: 16 },
      { name: '6월', value: 15 },
    ],
  },
  {
    id: 'reboarding_cycle',
    title: '재탑승주기',
    value: '22일',
    chartData: [
      { name: '1월', value: 25 },
      { name: '2월', value: 24 },
      { name: '3월', value: 24 },
      { name: '4월', value: 23 },
      { name: '5월', value: 22.5 },
      { name: '6월', value: 22 },
    ],
  },
];

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
  const [selectedId, setSelectedId] = useState<string>(MOCK_DATA[0].id);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [mounted, setMounted] = useState(false);
  const [tooltipState, setTooltipState] = useState<{
    show: boolean;
    rect: DOMRect | null;
    details: { artist: string; percent: number }[];
  }>({ show: false, rect: null, details: [] });

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentMetric =
    MOCK_DATA.find((m) => m.id === selectedId) || MOCK_DATA[0];

  const handleReset = () => {
    setDateRange([null, null]);
  };

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
    { label: '재예매율', key: 'rebookingRate' },
    { label: '재예매 주기', key: 'rebookingCycle' },
    { label: '재참여 주기', key: 'reparticipationCycle' },
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

        {/* Date Filter Controls */}
        <div className="flex items-center gap-8">
          <div className="relative flex items-center">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              locale={ko}
              dateFormat="yyyy.MM.dd"
              placeholderText="기간 선택"
              className="h-[40px] w-[240px] rounded-8 border border-basic-grey-300 px-12 py-8 text-14 text-basic-black outline-none focus:border-brand-primary-400"
            />
            <div className="pointer-events-none absolute right-12 text-basic-grey-400">
              <CalendarIcon size={16} />
            </div>
          </div>

          <Button
            variant="tertiary"
            size="medium"
            className="!h-[40px] !w-auto !px-12"
            onClick={handleReset}
          >
            <div className="flex items-center gap-4">
              <RotateCcwIcon size={14} />
              <span className="text-14">초기화</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-5 gap-16">
        {MOCK_DATA.map((item) => {
          const isActive = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`flex flex-col items-start rounded-16 border p-24 transition-all duration-200 ${
                isActive
                  ? 'border-basic-black bg-basic-black text-basic-white shadow-lg'
                  : 'border-basic-grey-200 bg-basic-white text-basic-black hover:border-basic-grey-400 hover:bg-basic-grey-50'
              }`}
            >
              <span
                className={`text-16 font-500 ${
                  isActive ? 'text-basic-grey-200' : 'text-basic-grey-600'
                }`}
              >
                {item.title}
              </span>
              <div className="mt-12 flex items-baseline gap-8">
                <span className="text-28 font-700">{item.value}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="flex w-full flex-col gap-24 rounded-24 border border-basic-grey-200 bg-basic-white p-32">
        <div className="flex items-center justify-between">
          <h2 className="text-20 font-700 text-basic-black">
            {currentMetric.title} 추이
          </h2>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={currentMetric.chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 14 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 14 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                itemStyle={{ color: '#111' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#111111"
                strokeWidth={3}
                dot={{ r: 4, fill: '#111111', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#111111' }}
              />
            </LineChart>
          </ResponsiveContainer>
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
                  <td className="px-16 py-20 text-14 font-600 text-[#A855F7]">
                    {row.rebookingRate}%
                  </td>
                  <td className="px-16 py-20 text-14 text-basic-grey-600">
                    {row.rebookingCycle}일
                  </td>
                  <td className="px-16 py-20 text-14 text-basic-grey-600">
                    {row.reparticipationCycle}일
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
