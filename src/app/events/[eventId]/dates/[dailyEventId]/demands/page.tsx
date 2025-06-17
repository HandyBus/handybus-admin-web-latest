'use client';

import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';
import BlueLink from '@/components/link/BlueLink';
import Map from './components/Map';
import { Suspense, useState } from 'react';
import Table from './components/Table';
import { formatDateString } from '@/utils/date.util';
import { useSuspenseGetEvent } from '@/services/event.service';
import Loading from '@/components/loading/Loading';
import { useParams } from 'next/navigation';

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
  const { data: event } = useSuspenseGetEvent(eventId);

  return (
    <main className="flex grow flex-col">
      <Heading className="flex items-baseline gap-12">
        수요조사 대시보드
        <div className="flex gap-12 pl-20 text-18 font-600">
          <button
            onClick={() => setTab('map')}
            className={`transition-colors hover:text-grey-900 ${
              tab === 'map' ? 'text-grey-900' : 'text-grey-300'
            }`}
          >
            지도
          </button>
          <button
            onClick={() => setTab('table')}
            className={`transition-colors hover:text-grey-900 ${
              tab === 'table' ? 'text-grey-900' : 'text-grey-300'
            }`}
          >
            목록
          </button>
        </div>
      </Heading>
      <Callout className="mb-16">
        <List>
          <List.item title="행사명">
            <BlueLink href={`/events/${eventId}`}>{event.eventName}</BlueLink>
          </List.item>
          <List.item title="날짜">
            {formatDateString(
              event.dailyEvents.find(
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
