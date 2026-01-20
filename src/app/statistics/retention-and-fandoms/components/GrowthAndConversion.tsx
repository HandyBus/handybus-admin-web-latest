'use client';

import { useState } from 'react';
import CustomLineChart from '@/components/chart/CustomLineChart';

const DUMMY_DATA = [
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
];

const FILTER_PERIODS = ['전체', '월간', '주간', '일간'];

const GrowthAndConversion = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('전체');

  return (
    <div className="flex w-full flex-col gap-16">
      <div className="flex items-center justify-between">
        <span className="text-20 font-600 text-basic-black">성장 및 전환</span>
        <div className="flex items-center gap-16">
          <div className="px-13 py-px flex h-full items-center rounded-8 border border-basic-grey-200 bg-basic-white">
            <div className="flex gap-8">
              {/* Icon placeholder */}
              <div className="size-16 rounded-full bg-basic-grey-400" />
              <span className="text-14 font-500 text-basic-grey-400">
                모든 기간
              </span>
            </div>
          </div>
          <div className="h-46 flex items-start rounded-8 bg-basic-white p-4">
            {FILTER_PERIODS.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex h-36 w-56 items-center justify-center rounded-8 text-14 font-500 ${
                  selectedPeriod === period
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

      <div className="flex w-full gap-16">
        <SummaryCard
          title="GMV"
          subtitle="매출"
          value="280만"
          unit="원"
          percentage="15.3%"
          isDark={false}
        />
        <SummaryCard
          title="활성유저"
          subtitle="탐색"
          value="85.7K"
          unit="명"
          percentage="15.3%"
          isDark={true}
        />
        <SummaryCard
          title="활성유저"
          subtitle="참여"
          value="280만"
          unit="원"
          percentage="15.3%"
          isDark={false}
        />
      </div>

      <div className="h-663 relative w-full overflow-hidden rounded-16 border border-basic-grey-400 bg-basic-white shadow-md">
        <div className="left-23 top-23 absolute">
          <p className="text-20 font-600 text-basic-black">활성유저 (탐색)</p>
        </div>
        <p className="right-23 top-23 absolute text-16 font-500 text-basic-grey-600">
          전체 기간 (1월 - 12월)
        </p>
        <div className="left-23 absolute top-108 h-[530px] w-[1280px]">
          <CustomLineChart
            data={DUMMY_DATA}
            dataKey={['value']}
            label={{ value: '활성유저' }}
          />
        </div>
      </div>

      <div className="flex w-full gap-16">
        <DetailCard title="신규 유저" percentage="15.3%" value="5K" unit="명" />
        <DetailCard
          title="신규 유저 구매전환율"
          percentage="15.3%"
          value="24.8"
          unit="%"
        />
        <DetailCard
          title="첫 구매 소요 시간"
          subtitle="평균"
          percentage="15.3%"
          value="3.2"
          unit="일"
        />
        <DetailCard
          title="첫 결제 매출기여도"
          percentage="15.3%"
          value="23.1"
          unit="%"
        />
      </div>
    </div>
  );
};

const SummaryCard = ({
  title,
  subtitle,
  value,
  unit,
  percentage,
  isDark,
}: {
  title: string;
  subtitle: string;
  value: string;
  unit: string;
  percentage: string;
  isDark: boolean;
}) => (
  <div
    className={`flex flex-1 flex-col gap-24 rounded-8 p-20 ${
      isDark ? 'bg-basic-black' : 'border border-basic-grey-200 bg-basic-white'
    }`}
  >
    <div className="flex gap-8 text-20 font-600">
      <span className={isDark ? 'text-basic-white' : 'text-basic-black'}>
        {title}
      </span>
      <span
        className={`text-16 font-500 ${
          isDark ? 'text-basic-grey-400' : 'text-basic-grey-600'
        }`}
      >
        {subtitle}
      </span>
    </div>
    <div className="flex w-full items-center justify-end gap-8">
      <div className="gap-6 flex items-center">
        {/* Up arrow icon */}
        <div className="size-16 rounded-full bg-[#00c58e]" />
        <span className="text-16 text-[#00c58e]">{percentage}</span>
      </div>
      <p
        className={`text-right text-28 font-600 ${
          isDark ? 'text-basic-white' : 'text-basic-black'
        }`}
      >
        {value}
      </p>
      <p
        className={`text-right text-16 font-500 ${
          isDark ? 'text-basic-grey-400' : 'text-basic-grey-600'
        }`}
      >
        {unit}
      </p>
    </div>
  </div>
);

const DetailCard = ({
  title,
  subtitle,
  percentage,
  value,
  unit,
}: {
  title: string;
  subtitle?: string;
  percentage: string;
  value: string;
  unit: string;
}) => (
  <div className="flex w-320 flex-col gap-24 rounded-8 border border-basic-grey-200 bg-basic-white p-20">
    <div className="flex items-start gap-8">
      <span className="text-20 font-600 text-basic-black">{title}</span>
      {subtitle && (
        <span className="text-16 font-500 text-basic-grey-600">{subtitle}</span>
      )}
    </div>
    <div className="flex w-full items-center justify-end gap-8">
      <div className="gap-6 flex items-center">
        <div className="size-16 rounded-full bg-[#00c58e]" />
        <span className="text-16 text-[#00c58e]">{percentage}</span>
      </div>
      <p className="text-right text-28 font-600 text-basic-black">{value}</p>
      <p className="text-right text-16 font-500 text-basic-grey-600">{unit}</p>
    </div>
  </div>
);

export default GrowthAndConversion;
