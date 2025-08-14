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
import { getColorByIndex } from './chart.util';
import { useMemo } from 'react';
import { ANIMATION_DURATION } from './chart.const';

interface Props {
  data: { name: string; value: number }[];
  colors?: string[];
  isLoading?: boolean;
}

const CustomBarChart = ({ data, colors, isLoading }: Props) => {
  const dataWithPercent = useMemo(() => {
    const maxValue = Math.max(...data.map((d) => d.value));
    return data.map((d) => ({
      ...d,
      percent: Math.round((d.value / maxValue) * 100),
    }));
  }, [data]);

  if (!data || isLoading) {
    return null;
  }
  return (
    <div className="grow">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dataWithPercent} margin={{ left: -10, right: 20 }}>
          <CartesianGrid stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="name"
            fontSize={12}
            fontWeight={500}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="percent"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data: {
                  name: string;
                  value: number;
                  percent: number;
                } = payload[0].payload;
                const totalCount = data.value;
                const percentage = data.percent;

                return (
                  <div className="min-w-60 rounded-[4px] border border-basic-grey-200 bg-basic-white p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
                    <h5 className="pb-4 text-14 font-500">{data.name}</h5>
                    <div className="flex items-baseline gap-4">
                      <p className="text-basic-grey-900 text-16">
                        {percentage}%
                      </p>
                      <p className="text-14 text-basic-grey-700">
                        {totalCount.toLocaleString()}명
                      </p>
                    </div>
                  </div>
                );
              }
            }}
          />
          <Bar dataKey="percent" animationDuration={ANIMATION_DURATION}>
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
