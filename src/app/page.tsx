'use client';

import Heading from '@/components/text/Heading';
import { useGetUserCounts } from '@/services/userManagement.service';
import { dayjsTz } from '@/utils/date.util';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const Page = () => {
  return (
    <main className="grow">
      <Heading>통계 대시보드</Heading>
      <section className="mx-auto w-full max-w-[1300px] p-12">
        <Heading.h3 className="bg-white font-600">성과 통계</Heading.h3>
        <div className="flex w-full flex-wrap justify-between gap-8">
          <UserCountChart />
          <UserCountChart />
          <UserCountChart />
          <UserCountChart />
          <UserCountChart />
          <UserCountChart />
        </div>
      </section>
    </main>
  );
};

export default Page;

const UserCountChart = () => {
  const { data: totalUserCounts } = useGetUserCounts();

  const parsedTotalUserCounts = totalUserCounts?.map((item) => ({
    ...item,
    date: dayjsTz(item.date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
    }),
  }));

  return (
    <article className="max-w-[412px] rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">
        총 유저 수
      </Heading.h4>
      <CustomLineChart
        data={parsedTotalUserCounts ?? []}
        dataKey="cumulativeUserCount"
      />
    </article>
  );
};

interface CustomLineChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
}

const CustomLineChart = ({ data, dataKey }: CustomLineChartProps) => {
  return (
    <LineChart
      width={400}
      height={220}
      data={data}
      margin={{ left: -20, right: 20 }}
    >
      <CartesianGrid stroke="#e5e7eb" vertical={false} />
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke="#6366f1"
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 6, fill: '#6366f1' }}
      />
      <XAxis
        dataKey="date"
        fontSize={10}
        tickLine={false}
        axisLine={false}
        interval={0}
      />
      <YAxis
        fontSize={10}
        tickLine={false}
        axisLine={false}
        allowDataOverflow={true}
        allowDecimals={false}
        type="number"
        domain={([dataMin, dataMax]) => {
          const min = Math.floor(dataMin * 0.95);
          const max = Math.floor(dataMax * 1.05);
          return [min, max];
        }}
      />
      <Tooltip
        contentStyle={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      />
    </LineChart>
  );
};
