'use client';

import Heading from '@/components/text/Heading';
import Map from './components/Map';
import { useState } from 'react';
import Table from './components/Table';

type Tab = 'map' | 'table';
interface Props {
  params: {
    eventId: string;
    dailyEventId: string;
  };
}

const Page = ({ params }: Props) => {
  const { eventId, dailyEventId } = params;

  const [tab, setTab] = useState<Tab>('map');

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
      <div className="flex grow gap-12">
        {tab === 'map' && <Map eventId={eventId} dailyEventId={dailyEventId} />}
        {tab === 'table' && (
          <Table eventId={eventId} dailyEventId={dailyEventId} />
        )}
      </div>
    </main>
  );
};

export default Page;
