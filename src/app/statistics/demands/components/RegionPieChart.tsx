'use client';

import Heading from '@/components/text/Heading';
import { ShuttleDemandStatisticsReadModel } from '@/types/demand.type';
import { useMemo } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

interface Props {
  sidoStats: ShuttleDemandStatisticsReadModel[] | undefined;
  gunguStats: ShuttleDemandStatisticsReadModel[] | undefined;
}

const RegionPieChart = ({ sidoStats, gunguStats }: Props) => {
  const parsedSidoStats = useMemo(() => {
    if (!sidoStats || !gunguStats) {
      return [];
    }
    return sidoStats
      ?.map((sidoStat) => {
        const filteredGunguStats = gunguStats
          ?.filter(
            (gunguStat) =>
              gunguStat.provinceFullName === sidoStat.provinceFullName,
          )
          .map((gunguStat) => ({
            name: gunguStat.cityFullName,
            totalCount: gunguStat.totalCount,
            roundTripCount: gunguStat.roundTripCount,
            toDestinationCount: gunguStat.toDestinationCount,
            fromDestinationCount: gunguStat.fromDestinationCount,
          }))
          .toSorted((a, b) => b.totalCount - a.totalCount)
          .slice(0, 3);
        return {
          name: sidoStat.provinceFullName,
          totalCount: sidoStat.totalCount,
          roundTripCount: sidoStat.roundTripCount,
          toDestinationCount: sidoStat.toDestinationCount,
          fromDestinationCount: sidoStat.fromDestinationCount,
          gunguStats: filteredGunguStats,
        };
      })
      .toSorted((a, b) => b.totalCount - a.totalCount);
  }, [sidoStats, gunguStats]);

  return (
    <section className="grow rounded-[6px] border border-grey-200 bg-white p-12">
      <Heading.h4>지역별 수요조사</Heading.h4>
      {parsedSidoStats.length > 0 && (
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
              data={parsedSidoStats}
              dataKey="totalCount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="90%"
              fill="#8884d8"
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
              }) => {
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
              {parsedSidoStats.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="min-w-100 rounded-[4px] border border-grey-200 bg-white p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
                      <h5 className="text-14 font-500">{data.name}</h5>
                      <p className="text-12 text-grey-700">
                        총 수요: {data.totalCount}건
                      </p>
                      <ul className="flex flex-col">
                        {data.gunguStats.map(
                          (gunguStat: { name: string; totalCount: number }) => (
                            <li
                              key={gunguStat.name}
                              className="text-12 text-grey-700"
                            >
                              {gunguStat.name}: {gunguStat.totalCount}건{' '}
                              {Math.round(
                                (gunguStat.totalCount / data.totalCount) * 100,
                              )}
                              %
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  );
                }
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </section>
  );
};

export default RegionPieChart;
