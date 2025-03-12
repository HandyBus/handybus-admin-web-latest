'use client';

import { ReactNode } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ANIMATION_DURATION } from './chart.const';
import { getColorByIndex } from './chart.util';

const RADIAN = Math.PI / 180;

interface Props<T> {
  data: T[] | undefined;
  dataKey: keyof T;
  renderTooltip?: (data: T) => ReactNode;
  colors?: string[];
  isLoading?: boolean;
}

const CustomPieChart = <T,>({
  data,
  dataKey,
  renderTooltip,
  colors,
  isLoading,
}: Props<T>) => {
  if (!data || isLoading) {
    return null;
  }
  return (
    <ResponsiveContainer width="80%" height="80%" className="mx-auto">
      <PieChart>
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          formatter={(value, entry) => (
            <span className="text-14">
              {value} ({entry.payload?.value}건)
            </span>
          )}
        />
        <Pie
          data={data}
          dataKey={dataKey as string}
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="90%"
          fill="#8884d8"
          animationDuration={ANIMATION_DURATION}
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            if (percent < 0.05) {
              return null;
            }
            const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-16 font-500"
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={getColorByIndex(index, colors)} />
          ))}
        </Pie>
        {renderTooltip && (
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return renderTooltip?.(data);
              }
            }}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
