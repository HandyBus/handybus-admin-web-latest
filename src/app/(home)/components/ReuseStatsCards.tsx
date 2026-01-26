import React from 'react';

/**
 * 디스플레이용 통계 데이터 구조
 */
export interface CardStats {
  first: {
    percentage: number;
    count: number;
  };
  reuse: {
    percentage: number;
    count: number;
  };
  total: number;
}

interface ReuseStatsCardsProps {
  /** 디스플레이할 통계 데이터 */
  cardStats: CardStats;
}

/**
 * 통계 카드를 표시하는 컴포넌트 (첫이용, 재이용, 총합)
 */
const ReuseStatsCards = ({ cardStats }: ReuseStatsCardsProps) => {
  return (
    <div className="flex flex-col gap-8 lg:w-272 lg:shrink-0">
      {/* 첫이용 카드 */}
      <div className="hover:border-indigo-100 group flex items-center justify-between rounded-8 border border-[#e6e6e6] bg-basic-white p-16 transition-all hover:shadow-md">
        <span className="text-16 font-500 text-basic-black">첫이용</span>
        <div className="flex flex-col items-end gap-0">
          <div className="flex items-baseline gap-8">
            <span className="text-28 font-600 text-basic-black">
              {cardStats.first.percentage}
            </span>
            <span className="text-16 font-500 text-[#808080]">%</span>
          </div>
          <span className="text-14 font-500 text-[#808080]">
            {cardStats.first.count.toLocaleString()}명
          </span>
        </div>
      </div>

      {/* 재이용 카드 */}
      <div className="hover:border-indigo-100 group flex items-center justify-between rounded-8 border border-[#e6e6e6] bg-basic-white p-16 transition-all hover:shadow-md">
        <span className="text-16 font-500 text-basic-black">재이용</span>
        <div className="flex flex-col items-end gap-0">
          <div className="flex items-baseline gap-8">
            <span className="text-28 font-600 text-basic-black">
              {cardStats.reuse.percentage}
            </span>
            <span className="text-16 font-500 text-[#808080]">%</span>
          </div>
          <span className="text-14 font-500 text-[#808080]">
            {cardStats.reuse.count.toLocaleString()}명
          </span>
        </div>
      </div>

      {/* 총합 카드 */}
      <div className="flex items-center justify-between rounded-8 border border-[#e6e6e6] bg-basic-white px-16 py-16">
        <span className="text-16 font-500 text-basic-black">총합</span>
        <span className="text-14 font-500 text-basic-black">
          {cardStats.total.toLocaleString()}명
        </span>
      </div>
    </div>
  );
};

export default ReuseStatsCards;
