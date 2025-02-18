'use client';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const STROKE_COLORS = ['#6366f1', '#f59e0b', '#14b8a6'];

const LABEL_MAP: { [key: string]: string } = {
  intervalUserCount: '일일 가입자',
  cumulativeUserCount: '누적 가입자',
  intervalDemandCount: '일일 수요조사',
  cumulativeDemandCount: '누적 수요조사',
  intervalReservationPassengerCount: '일일 예약 탑승객',
  cumulativeReservationPassengerCount: '누적 예약 탑승객',
  dailyGrossSales: '일일 판매액',
  cumulativeGrossSales: '누적 판매액',
  dailyDiscountedSales: '일일 할인 적용 판매액',
  cumulativeDiscountedSales: '누적 할인 적용 판매액',
  intervalReviewCount: '일일 리뷰',
  cumulativeReviewCount: '누적 리뷰',
};

interface Props<T> {
  data: T[];
  dataKey: (keyof T)[];
}

const CustomLineChart = <T,>({ data, dataKey }: Props<T>) => {
  return (
    <LineChart
      width={400}
      height={220}
      data={data}
      margin={{ left: -10, right: 20 }}
    >
      <CartesianGrid stroke="#e5e7eb" vertical={false} />
      <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
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
        tickFormatter={(value) => {
          if (value >= 100000000) {
            return `${(value / 100000000).toFixed(1)}억`;
          }
          if (value >= 10000000) {
            return `${(value / 10000000).toFixed(1)}천만`;
          }
          if (value >= 10000) {
            return `${(value / 10000).toFixed(1)}만`;
          }
          return value.toString();
        }}
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
          return [formattedValue, LABEL_MAP[name] || name];
        }}
      />
    </LineChart>
  );
};

export default CustomLineChart;
