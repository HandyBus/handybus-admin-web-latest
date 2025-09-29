'use client';

import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';
import BlueLink from '@/components/link/BlueLink';
import Map from './components/Map';
import { Suspense, useState } from 'react';
import Table from './components/Table';
import { formatDateString } from '@/utils/date.util';
import { useGetEvent } from '@/services/event.service';
import Loading from '@/components/loading/Loading';
import { useParams } from 'next/navigation';
import useExportDemandRequestersList from './hooks/useExportDemandRequestersList';

type Tab = 'map' | 'table';

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <DemandContent />
    </Suspense>
  );
};

export default Page;

const DemandContent = () => {
  const { eventId, dailyEventId } = useParams<{
    eventId: string;
    dailyEventId: string;
  }>();
  const [tab, setTab] = useState<Tab>('map');
  const { data: event, isLoading, isError } = useGetEvent(eventId);

  const { exportDemandRequestersList } = useExportDemandRequestersList({
    eventId,
    dailyEventId,
  });

  if (isLoading) return <Loading />;
  if (isError) throw new Error('행사 데이터 조회에 실패했습니다.');
  return (
    <main className="flex grow flex-col">
      <Heading className="flex items-baseline gap-12">
        수요조사 대시보드
        <div className="flex gap-12 pl-20 text-18 font-600">
          <button
            onClick={() => setTab('map')}
            className={`transition-colors hover:text-basic-grey-700 ${
              tab === 'map' ? 'text-basic-grey-700' : 'text-basic-grey-300'
            }`}
          >
            지도
          </button>
          <button
            onClick={() => setTab('table')}
            className={`transition-colors hover:text-basic-grey-700 ${
              tab === 'table' ? 'text-basic-grey-700' : 'text-basic-grey-300'
            }`}
          >
            목록
          </button>
          <button
            className="text-14 text-basic-blue-400 underline underline-offset-[3px]"
            onClick={async () => await exportDemandRequestersList()}
          >
            수요조사 명단추출
          </button>
        </div>
      </Heading>
      <Callout className="mb-16">
        <List>
          <List.item title="행사명">
            <BlueLink href={`/events/${eventId}`}>{event?.eventName}</BlueLink>
          </List.item>
          <List.item title="날짜">
            {formatDateString(
              event?.dailyEvents.find(
                (dailyEvent) => dailyEvent.dailyEventId === dailyEventId,
              )?.date,
            )}
          </List.item>
        </List>
      </Callout>
      <div className="flex grow gap-12">
        {tab === 'map' && <Map eventId={eventId} dailyEventId={dailyEventId} />}
        {tab === 'table' && (
          <Table eventId={eventId} dailyEventId={dailyEventId} />
        )}
      </div>
    </main>
  );
};
