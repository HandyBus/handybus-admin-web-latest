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
  onBarClick?: (name: string) => void;
  activeBar?: string | null;
  barActionLabel?: string;
  percentMode?: 'max' | 'total';
}

const CustomBarChart = ({
  data,
  colors,
  isLoading,
  onBarClick,
  activeBar,
  barActionLabel,
  percentMode = 'max',
}: Props) => {
  const dataWithPercent = useMemo(() => {
    const denominator =
      percentMode === 'total'
        ? data.reduce((sum, chartData) => sum + chartData.value, 0)
        : Math.max(...data.map((chartData) => chartData.value));
    const safeDenominator = Math.max(1, denominator);

    return data.map((d) => ({
      ...d,
      percent: Math.round((d.value / safeDenominator) * 100),
    }));
  }, [data, percentMode]);

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
                const payloadData: {
                  name: string;
                  value: number;
                  percent: number;
                } = payload[0].payload;
                const totalCount = payloadData.value;
                const percentage = payloadData.percent;

                return (
                  <div className="min-w-60 rounded-[4px] border border-basic-grey-200 bg-basic-white p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
                    <h5 className="pb-4 text-14 font-500">
                      {payloadData.name}
                    </h5>
                    <div className="flex items-baseline gap-4">
                      <p className="text-16 text-basic-grey-700">
                        {percentage}%
                      </p>
                      <p className="text-14 text-basic-grey-700">
                        {totalCount.toLocaleString()}명
                      </p>
                    </div>
                    {onBarClick && (
                      <p className="pt-4 text-12 text-basic-grey-500">
                        {barActionLabel ??
                          '클릭하면 상세 사유를 볼 수 있습니다.'}
                      </p>
                    )}
                  </div>
                );
              }
            }}
          />
          <Bar
            dataKey="percent"
            animationDuration={ANIMATION_DURATION}
            cursor={onBarClick ? 'pointer' : undefined}
          >
            {dataWithPercent.map((d, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColorByIndex(index, colors)}
                opacity={activeBar != null && activeBar !== d.name ? 0.3 : 1}
                onClick={() => onBarClick?.(d.name)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
