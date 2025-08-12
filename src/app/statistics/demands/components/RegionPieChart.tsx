'use client';

import CustomPieChart from '@/components/chart/CustomPieChart';
import Heading from '@/components/text/Heading';
import { ShuttleDemandStatisticsReadModel } from '@/types/demand.type';
import { useMemo } from 'react';

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

  const renderTooltip = (data: (typeof parsedSidoStats)[0]) => {
    return (
      <div className="min-w-100 rounded-[4px] border border-basic-grey-200 bg-basic-white p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
        <h5 className="text-14 font-500">{data.name}</h5>
        <p className="text-12 text-basic-grey-700">
          총 수요: {data.totalCount}건
        </p>
        <ul className="flex flex-col">
          {data.gunguStats.map((gunguStat) => (
            <li key={gunguStat.name} className="text-12 text-basic-grey-700">
              {gunguStat.name}: {gunguStat.totalCount}건{' '}
              {Math.round((gunguStat.totalCount / data.totalCount) * 100)}%
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section className="grow rounded-[6px] border border-basic-grey-200 bg-basic-white p-12">
      <Heading.h4>지역별 수요조사</Heading.h4>
      {parsedSidoStats.length > 0 && (
        <CustomPieChart
          data={parsedSidoStats}
          dataKey="totalCount"
          renderTooltip={renderTooltip}
        />
      )}
    </section>
  );
};

export default RegionPieChart;
