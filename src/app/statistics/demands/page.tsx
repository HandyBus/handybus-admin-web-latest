'use client';

import Heading from '@/components/text/Heading';
import Map from './components/Map';
import RegionPieChart from './components/RegionPieChart';
import { useGetDemandsStats } from '@/services/shuttleOperation.service';

const Page = () => {
  const { data: sidoStats, isLoading: isSidoStatsLoading } = useGetDemandsStats(
    {
      groupBy: 'PROVINCE',
    },
  );
  const { data: gunguStats, isLoading: isGunguStatsLoading } =
    useGetDemandsStats({
      groupBy: 'CITY',
    });

  return (
    <main className="flex grow flex-col">
      <Heading>
        수요조사 통계
        <span className="ml-12 text-12 text-grey-500">
          지도 내의 시군구 영역은 정확하지 않을 수 있습니다.
        </span>
      </Heading>
      <div className="grid grow grid-cols-2 gap-12">
        <Map
          sidoStats={sidoStats}
          gunguStats={gunguStats}
          isSidoStatsLoading={isSidoStatsLoading}
          isGunguStatsLoading={isGunguStatsLoading}
        />
        <RegionPieChart sidoStats={sidoStats} gunguStats={gunguStats} />
      </div>
    </main>
  );
};

export default Page;
