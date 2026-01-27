import React from 'react';
import { ChevronDown } from 'lucide-react';
import { EventsViewEntity } from '@/types/event.type';
import ReuseChart, { ChartData } from './ReuseChart';
import ReuseStatsCards, { CardStats } from './ReuseStatsCards';

interface ReuseContentProps {
  selectedEvent: EventsViewEntity | null;
  isLoadingEvents: boolean;
  isLoadingStats: boolean;
  chartData: ChartData[];
  cardStats: CardStats | null;
}

const ReuseContent = ({
  selectedEvent,
  isLoadingEvents,
  isLoadingStats,
  chartData,
  cardStats,
}: ReuseContentProps) => {
  if (!selectedEvent) {
    return (
      <div className="bg-gray-50/50 flex flex-1 flex-col items-center justify-center gap-12 rounded-12">
        <div className="bg-gray-100 text-gray-400 flex h-48 w-48 items-center justify-center rounded-full">
          <ChevronDown className="h-24 w-24" />
        </div>
        <p className="text-16 font-500 text-[#6a7282]">
          {isLoadingEvents
            ? '행사 목록을 불러오는 중입니다...'
            : '상단에서 행사를 선택하여 데이터를 확인하세요'}
        </p>
      </div>
    );
  }

  if (isLoadingStats) {
    return (
      <div className="bg-gray-50/50 flex flex-1 flex-col items-center justify-center gap-12 rounded-12">
        <div className="border-gray-300 border-t-indigo-500 h-24 w-24 animate-spin rounded-full border-2" />
        <p className="text-16 font-500 text-[#6a7282]">
          통계 데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (!cardStats) {
    return (
      <div className="bg-gray-50/50 flex flex-1 flex-col items-center justify-center gap-12 rounded-12">
        <p className="text-16 font-500 text-[#6a7282]">
          해당 행사의 이용 데이터가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-24 lg:flex-row lg:items-center">
      <ReuseChart data={chartData} />
      <ReuseStatsCards cardStats={cardStats} />
    </div>
  );
};

export default ReuseContent;
