'use client';

import BlueLink from '@/components/link/BlueLink';
import Guide from '@/components/guide/Guide';
import { columns } from './types/table.type';
import Shuttle from './components/Shuttle';
import { getShuttle } from '@/services/v1/shuttle.services';
import DataTable from '@/components/table/DataTable';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useMemo } from 'react';
import JSONViewer from '@/components/json/JSONViewer';

interface Props {
  params: { eventId: string };
}

const Page = ({ params: { eventId } }: Props) => {
  const { data: shuttle } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getShuttle(Number(eventId)),
  });

  const columnsForThisShuttleId = useMemo(
    () => columns(Number(eventId)),
    [eventId],
  );

  if (!shuttle)
    return (
      <div>
        <Loader2Icon className="animate-spin" size={64} />
      </div>
    );

  return (
    <main className="flex size-full flex-col gap-16 bg-white ">
      <h1 className="text-[32px] font-500">이벤트 상세</h1>
      <div className="flex flex-col gap-16">
        <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
          <JSONViewer value={shuttle} />
          <BlueLink href={`${eventId}/edit`}>수정</BlueLink>
        </div>
        <Shuttle shuttle={shuttle} />
        <header className="flex flex-row justify-between pt-32  ">
          <h2 className="text-[24px] font-500">수요 통계</h2>
        </header>
        <div>{shuttle.totalDemandCount}개의 수요 조사가 있습니다.</div>

        <header className="flex flex-row justify-between pt-32  ">
          <h2 className="text-[24px] font-500">일자별 콘서트 목록</h2>
        </header>
        <Guide>
          <dfn>일자별 셔틀</dfn>은 <strong>목적지, 날짜 (및 아티스트)</strong>가
          같은, 버스가 <strong>0대 이상 제공될 가능성이 있는</strong> 이벤트를
          의미합니다. 다음은 현재 셔틀에 딸린 일자별 셔틀 목록입니다.
        </Guide>
        <DataTable
          columns={columnsForThisShuttleId}
          data={shuttle.dailyShuttles}
        />
      </div>
    </main>
  );
};

export default Page;
