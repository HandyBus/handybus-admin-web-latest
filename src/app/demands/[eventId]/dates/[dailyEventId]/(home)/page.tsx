'use client';

import useTable from '@/hooks/useTable';
import { columnsFrom, columnsTo } from './types/table.type';
import BaseTable from '@/components/table/BaseTable';
import PartialRegionInput, {
  PartialRegion,
} from '@/components/input/PartialRegionInput';
import { useState } from 'react';
import BlueLink from '@/components/link/BlueLink';
import { useSearchParams } from 'next/navigation';
import { formatDateString } from '@/utils/date.util';
import {
  GetDemandOptions,
  useGetDemandsStats,
  useGetEvent,
} from '@/services/shuttleOperation.service';

interface Props {
  params: { eventId: string; dailyEventId: string };
}

const Page = ({ params: { eventId, dailyEventId } }: Props) => {
  const sp = useSearchParams();
  const province = sp.get('provinceFullName');
  const city = sp.get('cityFullName');

  const [partialRegion, setPartialRegion] = useState<PartialRegion>({
    province,
    city,
  });

  const { data: event } = useGetEvent(Number(eventId));

  const dailyEvent = event?.dailyEvents.find(
    (d) => d.dailyEventId === Number(dailyEventId),
  );

  const optionTo: GetDemandOptions = {
    groupBy: 'TO_DESTINATION_REGION_HUB',
    provinceFullName: partialRegion.province ?? undefined,
    cityFullName: partialRegion.city ?? undefined,
    dailyEventId: Number(dailyEventId),
    eventId: Number(eventId),
  };

  const optionFrom: GetDemandOptions = {
    groupBy: 'FROM_DESTINATION_REGION_HUB',
    provinceFullName: partialRegion.province ?? undefined,
    cityFullName: partialRegion.city ?? undefined,
    dailyEventId: Number(dailyEventId),
    eventId: Number(eventId),
  };

  const {
    data: dataTo,
    isPending: isPendingTo,
    isError: isErrorTo,
    error: errorTo,
  } = useGetDemandsStats(optionTo);

  const {
    data: dataFrom,
    isPending: isPendingFrom,
    isError: isErrorFrom,
    error: errorFrom,
  } = useGetDemandsStats(optionFrom);

  const tableTo = useTable({
    data: dataTo,
    columns: columnsTo,
    state: {
      columnVisibility: {
        provinceFullName: partialRegion.province === null,
        cityFullName: partialRegion.city === null,
      },
    },
  });
  const tableFrom = useTable({
    data: dataFrom,
    columns: columnsFrom,
    state: {
      columnVisibility: {
        provinceFullName: partialRegion.province === null,
        cityFullName: partialRegion.city === null,
      },
    },
  });

  return (
    <div className="flex flex-col gap-16">
      <h1 className="text-[32px] font-500">
        <BlueLink href={`/events/${eventId}`}>{event?.eventName}</BlueLink>의{' '}
        <BlueLink href={`/events/${eventId}/dates/${dailyEventId}`}>
          {dailyEvent && formatDateString(dailyEvent.date, 'date')}
        </BlueLink>
        일자의 수요
      </h1>
      <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
        <BlueLink href={`/demands/${eventId}`}>
          이 행사의 모든 날짜 수요
        </BlueLink>
      </div>

      <PartialRegionInput value={partialRegion} setValue={setPartialRegion} />

      <article>
        <h2 className="text-[24px] font-500">목적지 방향 희망 탑승지 수요</h2>
        <BaseTable table={tableTo} />
        {dataTo && dataTo.length === 0 && <div>데이터가 없습니다.</div>}
        {isPendingTo && <div>Loading...</div>}
        {isErrorTo && <div>Failed to load, message: ${errorTo.message} </div>}
      </article>

      <article>
        <h2 className="text-[24px] font-500">귀가 방향 탑승지 수요</h2>
        <BaseTable table={tableFrom} />
        {dataFrom && dataFrom.length === 0 && <div>데이터가 없습니다.</div>}
        {isPendingFrom && <div>Loading...</div>}
        {isErrorFrom && (
          <div>Failed to load, message: ${errorFrom.message} </div>
        )}
      </article>
    </div>
  );
};

export default Page;
