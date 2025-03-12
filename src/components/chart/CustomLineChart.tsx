'use client';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ANIMATION_DURATION } from './chart.const';
import { numberTickFormatter } from './chart.util';

const STROKE_COLORS = ['#6366f1', '#f59e0b', '#14b8a6'];

interface Props<T> {
  data: T[];
  dataKey: (keyof T)[];
  label?: { [key: string]: string };
}

const CustomLineChart = <T,>({ data, dataKey, label }: Props<T>) => {
  return (
    <div className="grow">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -10, right: 20 }}>
          <CartesianGrid stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="date"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            fontSize={10}
            tickLine={false}
            axisLine={false}
            allowDataOverflow={true}
            allowDecimals={false}
            type="number"
            domain={([dataMin, dataMax]) => {
              const diff = 0.1;
              const min = Math.floor((dataMin * (1 - diff)) / 10) * 10;
              const max = Math.ceil((dataMax * (1 + diff)) / 10) * 10;
              return [min, max];
            }}
            tickFormatter={numberTickFormatter}
          />
          {dataKey.map((key, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={key as string}
              stroke={STROKE_COLORS[index % STROKE_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: STROKE_COLORS[index % STROKE_COLORS.length],
              }}
              animationDuration={ANIMATION_DURATION}
            />
          ))}
          <Tooltip
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number, name: string) => {
              const formattedValue = value.toLocaleString('ko-KR');
              return [formattedValue, label?.[name] || name];
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
