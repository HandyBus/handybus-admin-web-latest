'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getColorByIndex, percentageTickFormatter } from './chart.util';
import { useMemo } from 'react';
import { ANIMATION_DURATION } from './chart.const';

interface Props {
  data: { name: string; value: number }[];
  colors?: string[];
}

const CustomBarChart = ({ data, colors }: Props) => {
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value)), [data]);
  return (
    <div className="grow">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -10, right: 20 }}>
          <CartesianGrid stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="name"
            fontSize={12}
            fontWeight={500}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            fontSize={10}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            tickFormatter={(value) => percentageTickFormatter(value, maxValue)}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data: { name: string; value: number } =
                  payload[0].payload;
                const totalCount = data.value;
                const percentage = Math.round((data.value / maxValue) * 100);

                return (
                  <div className="min-w-60 rounded-[4px] border border-grey-200 bg-white p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
                    <h5 className="pb-4 text-14 font-500">{data.name}</h5>
                    <div className="flex items-baseline gap-4">
                      <p className="text-16 text-grey-900">{percentage}%</p>
                      <p className="text-14 text-grey-800">
                        {totalCount.toLocaleString()}명
                      </p>
                    </div>
                  </div>
                );
              }
            }}
          />
          <Bar dataKey="value" animationDuration={ANIMATION_DURATION}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColorByIndex(index, colors)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
