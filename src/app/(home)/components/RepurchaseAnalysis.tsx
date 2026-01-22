'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useGetEvents } from '@/services/event.service';
import { EventsViewEntity } from '@/types/event.type';
import { filterByFuzzy } from '@/utils/fuzzy.util';
import Heading from '@/components/text/Heading';

interface RepurchaseData {
  repurchase: {
    percentage: number;
    count: number;
  };
  firstPurchase: {
    percentage: number;
    count: number;
  };
  totalBuyers: number;
}

const COLORS = ['#6366f1', '#e5e7eb'];

const RADIAN = Math.PI / 180;

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  index,
  name,
}: PieLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Smart text color based on background slice color
  // Index 0 is Indigo (#6366f1) -> White text
  // Index 1 is Gray (#e5e7eb) -> Black text
  const fill = index === 0 ? 'white' : '#1f2937'; // 1f2937 is gray-800

  return (
    <text
      x={x}
      y={y}
      fill={fill}
      textAnchor="middle"
      dominantBaseline="central"
      className="text-14 font-600"
    >
      {name}
    </text>
  );
};

const RepurchaseAnalysis = () => {
  const [query, setQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventsViewEntity | null>(
    null,
  );

  const { data: events, isLoading } = useGetEvents();

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return query
      ? filterByFuzzy(
          events,
          query,
          (event) =>
            `${event.eventName} ${event.eventLocationName} ${event.eventArtists?.join(' ') ?? ''}`,
        )
      : events;
  }, [events, query]);

  const handleEventChange = useCallback((event: EventsViewEntity | null) => {
    setSelectedEvent(event);
    setQuery('');
  }, []);

  // TODO: Replace with actual API call when available
  // Mock data adjusted to be mathematically consistent (36 + 64 = 100)
  const repurchaseData: RepurchaseData | null = selectedEvent
    ? {
        repurchase: {
          percentage: 36,
          count: 1832,
        },
        firstPurchase: {
          percentage: 64,
          count: 3257,
        },
        totalBuyers: 5089,
      }
    : null;

  const chartData = repurchaseData
    ? [
        {
          name: '재방문',
          value: repurchaseData.repurchase.percentage,
          count: repurchaseData.repurchase.count,
        },
        {
          name: '첫구매',
          value: repurchaseData.firstPurchase.percentage,
          count: repurchaseData.firstPurchase.count,
        },
      ]
    : [];

  return (
    <div className="flex w-full flex-col gap-32">
      <Heading.h3> 행사별 첫 이용 유저 비율</Heading.h3>

      <div className="flex min-h-[420px] w-full flex-col rounded-16 bg-basic-white p-24 shadow-md md:p-32">
        {/* Header Section */}
        <div className="mb-24 flex flex-col justify-end gap-16 md:flex-row md:items-center">
          <Combobox
            immediate
            value={selectedEvent}
            onChange={handleEventChange}
            onClose={() => setQuery('')}
          >
            <div className="relative w-full md:w-272">
              <ComboboxButton className="absolute right-12 top-1/2 -translate-y-1/2 text-basic-black">
                <ChevronDown className="h-20 w-20" />
              </ComboboxButton>
              <ComboboxInput
                className="w-full rounded-8 border border-basic-black py-8 pl-12 pr-40 text-16 font-500 text-basic-black focus:outline-none"
                placeholder="행사를 선택하세요"
                displayValue={(event: EventsViewEntity | null) =>
                  event?.eventName ?? ''
                }
                onChange={(e) => setQuery(e.target.value)}
              />
              <ComboboxOptions
                anchor="bottom"
                className="ring-black z-50 mt-4 max-h-240 w-[var(--input-width)] overflow-auto rounded-8 bg-basic-white p-4 shadow-lg ring-1 ring-opacity-5 focus:outline-none"
              >
                {isLoading ? (
                  <div className="p-8 text-center text-basic-grey-400">
                    로딩 중...
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="p-8 text-center text-basic-grey-400">
                    검색 결과가 없습니다
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <ComboboxOption
                      key={event.eventId}
                      value={event}
                      className="hover:bg-indigo-50 data-[focus]:bg-indigo-50 cursor-pointer select-none rounded-4 px-12 py-8 text-14 text-basic-black"
                    >
                      {event.eventName}
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </div>
          </Combobox>
        </div>

        {/* Content Section */}
        {!selectedEvent ? (
          <div className="bg-gray-50/50 flex flex-1 flex-col items-center justify-center gap-12 rounded-12">
            <div className="bg-gray-100 text-gray-400 flex h-48 w-48 items-center justify-center rounded-full">
              <ChevronDown className="h-24 w-24" />
            </div>
            <p className="text-16 font-500 text-[#6a7282]">
              상단에서 행사를 선택하여 데이터를 확인하세요
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-24 lg:flex-row lg:items-center">
            {/* Chart Section */}
            <div className="relative h-[260px] w-full flex-1">
              {chartData.length > 0 && (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        innerRadius={0}
                        outerRadius={120}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={0}
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            strokeWidth={0}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>

            {/* Statistics Cards */}
            <div className="flex flex-col gap-8 lg:w-272 lg:shrink-0">
              {/* 재방문 Card */}
              <div className="hover:border-indigo-100 group flex items-center justify-between rounded-8 border border-[#e6e6e6] bg-basic-white p-16 transition-all hover:shadow-md">
                <span className="text-16 font-500 text-basic-black">
                  재방문
                </span>
                <div className="flex flex-col items-end gap-0">
                  <div className="flex items-baseline gap-8">
                    <span className="text-28 font-600 text-basic-black">
                      {repurchaseData?.repurchase.percentage}
                    </span>
                    <span className="text-16 font-500 text-[#808080]">%</span>
                  </div>
                  <span className="text-14 font-500 text-[#808080]">
                    {repurchaseData?.repurchase.count.toLocaleString()}명
                  </span>
                </div>
              </div>

              {/* 첫구매 Card */}
              <div className="hover:border-indigo-100 group flex items-center justify-between rounded-8 border border-[#e6e6e6] bg-basic-white p-16 transition-all hover:shadow-md">
                <span className="text-16 font-500 text-basic-black">
                  첫구매
                </span>
                <div className="flex flex-col items-end gap-0">
                  <div className="flex items-baseline gap-8">
                    <span className="text-28 font-600 text-basic-black">
                      {repurchaseData?.firstPurchase.percentage}
                    </span>
                    <span className="text-16 font-500 text-[#808080]">%</span>
                  </div>
                  <span className="text-14 font-500 text-[#808080]">
                    {repurchaseData?.firstPurchase.count.toLocaleString()}명
                  </span>
                </div>
              </div>

              {/* 총 구매자 Card */}
              <div className="flex items-center justify-between rounded-8 border border-[#e6e6e6] bg-basic-white px-16 py-16">
                <span className="text-16 font-500 text-basic-black">
                  총 구매자
                </span>
                <span className="text-14 font-500 text-basic-black">
                  {repurchaseData?.totalBuyers.toLocaleString()}명
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepurchaseAnalysis;
