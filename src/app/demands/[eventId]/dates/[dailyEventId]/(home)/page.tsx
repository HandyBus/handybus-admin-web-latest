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
import Heading from '@/components/text/Heading';
import List from '@/components/text/List';
import Callout from '@/components/text/Callout';

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
    <main>
      <Heading>수요조사 상세 조회</Heading>
      <Callout>
        <List>
          <List.item title="행사명">
            <BlueLink href={`/events/${eventId}`}>{event?.eventName}</BlueLink>
          </List.item>
          <List.item title="일자">
            <BlueLink href={`/events/${eventId}/dates/${dailyEventId}`}>
              {dailyEvent && formatDateString(dailyEvent.date, 'date')}
            </BlueLink>
          </List.item>
        </List>
      </Callout>
      <div className="flex flex-col gap-16 pt-20">
        <section>
          <Heading.h2>
            지역 선택{' '}
            <span className="text-14 text-grey-700">
              수요를 확인하고자 하는 지역을 선택해주세요.
            </span>
          </Heading.h2>
          <PartialRegionInput
            value={partialRegion}
            setValue={setPartialRegion}
          />
        </section>
        <section>
          <Heading.h2>수요조사 정보</Heading.h2>
          <Callout>
            <span>
              {`${partialRegion.province ?? '전체'}${partialRegion.city ? ' ' + partialRegion.city : ''}${partialRegion.province ? '의' : ''} 수요조사 정보를 보여드립니다.`}
            </span>
          </Callout>
          <div className="flex flex-col gap-16">
            <article className="flex flex-col">
              <Heading.h3>목적지행 희망 탑승지 수요</Heading.h3>
              <BaseTable table={tableTo} />
              {dataTo && dataTo.length === 0 && <div>데이터가 없습니다.</div>}
              {isPendingTo && <div>Loading...</div>}
              {isErrorTo && (
                <div>Failed to load, message: ${errorTo.message} </div>
              )}
            </article>
            <article className="flex flex-col">
              <Heading.h3>귀가행 탑승지 수요</Heading.h3>
              <BaseTable table={tableFrom} />
              {dataFrom && dataFrom.length === 0 && (
                <div>데이터가 없습니다.</div>
              )}
              {isPendingFrom && <div>Loading...</div>}
              {isErrorFrom && (
                <div>Failed to load, message: ${errorFrom.message} </div>
              )}
            </article>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
