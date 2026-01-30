import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';

export interface ChartData {
  name: string;
  value: number;
  displayValue: number;
  participation: number;
  reservation: number;
  demand: number;
  color: string;
}

interface ReuseChartProps {
  data: ChartData[];
}

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
  percent,
}: PieLabelProps) => {
  if (percent === 0) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Index 0은 인디고 (#6366f1) => 흰색 텍스트
  // Index 1은 회색 (#e5e7eb) => 검은색 텍스트
  const fill = index === 0 ? 'white' : '#1f2937';

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

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartData;
    return (
      <div className="border-gray-200 rounded-8 border bg-basic-white p-12 shadow-lg">
        <p className="text-gray-900 mb-8 text-14 font-600">
          ({data.name}) 참여 유저수 : {data.participation.toLocaleString()}
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-16">
            <span className="text-gray-500 text-12">예약</span>
            <span className="text-gray-900 text-12 font-500">
              {data.reservation.toLocaleString()}명
            </span>
          </div>
          <div className="flex items-center justify-between gap-16">
            <span className="text-gray-500 text-12">수요조사</span>
            <span className="text-gray-900 text-12 font-500">
              {data.demand.toLocaleString()}명
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ReuseChart = ({ data }: ReuseChartProps) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="relative h-[260px] w-full flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReuseChart;
