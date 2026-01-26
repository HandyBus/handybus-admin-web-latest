'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { ANIMATION_DURATION } from '@/components/chart/chart.const';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import Heading from '@/components/text/Heading';

// TODO: Replace with actual API call when available
const MOCK_DATA = [
  { month: '1월', value: 5 },
  { month: '2월', value: 8 },
  { month: '3월', value: 12 },
  { month: '4월', value: 18 },
  { month: '5월', value: 15 },
  { month: '6월', value: 10 },
  { month: '7월', value: 6 },
  { month: '8월', value: 14 },
  { month: '9월', value: 16 },
  { month: '10월', value: 20 },
  { month: '11월', value: 22 },
  { month: '12월', value: 25 },
];

const YEARS = ['2023', '2024', '2025', '2026'];

const ActiveEvents = () => {
  const [selectedYear, setSelectedYear] = useState('2026');

  return (
    <div className="flex w-full flex-col gap-32">
      <Heading.h4>월별 활성 행사 수</Heading.h4>

      <div className="flex min-h-[420px] w-full flex-col rounded-16 bg-basic-white p-24 shadow-md md:p-32">
        {/* Header Section */}
        <div className="mb-24 flex items-center justify-end">
          <Listbox value={selectedYear} onChange={setSelectedYear}>
            <div className="relative">
              <ListboxButton className="flex w-136 items-center justify-between rounded-8 border border-basic-black px-12 py-8 text-16 font-500 text-basic-black hover:bg-basic-grey-50 focus:outline-none">
                {selectedYear} 년
                <ChevronDown className="ml-8 h-20 w-20 text-basic-black" />
              </ListboxButton>
              <ListboxOptions
                anchor="bottom end"
                className="ring-black z-50 mt-4 max-h-240 w-136 overflow-auto rounded-8 bg-basic-white p-4 shadow-lg ring-1 ring-opacity-5 focus:outline-none"
              >
                {YEARS.map((year) => (
                  <ListboxOption
                    key={year}
                    value={year}
                    className="data-[focus]:bg-indigo-50 group flex cursor-pointer select-none items-center gap-8 rounded-4 px-12 py-8"
                  >
                    <div className="text-14 text-basic-black group-data-[selected]:font-600">
                      {year} 년
                    </div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>

        {/* Chart Section */}
        <div className="flex flex-1 flex-col">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MOCK_DATA}
                margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
              >
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }} // gray-500
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as {
                        month: string;
                        value: number;
                      };
                      return (
                        <div className="rounded-8 border border-basic-grey-200 bg-basic-white p-12 shadow-lg">
                          <p className="mb-4 text-12 font-500 text-basic-grey-500">
                            {data.month}
                          </p>
                          <p className="text-indigo-600 text-16 font-600">
                            {data.value}개
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                  animationDuration={ANIMATION_DURATION}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveEvents;
