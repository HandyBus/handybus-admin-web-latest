'use client';

import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import BlueLink from '@/components/link/BlueLink';
import { notFound } from 'next/navigation';
import { getColumns } from './table.type';
import { useEffect, useMemo } from 'react';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';
import {
  useGetShuttleRoutesOfDailyEvent,
  useGetAlertRequests,
} from '@/services/shuttleRoute.service';
import { useGetEvent } from '@/services/event.service';
import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';
import { HANDY_PARTY_PREFIX } from '@/constants/common';
import { HANDY_PARTY_ROUTE_AREA } from '@/constants/handyPartyArea.const';
import EditDailyEventOpenChatUrl from './EditDailyEventOpenChatUrl';
import { useSendShuttleInformation } from '@/services/solapi.service';
import useExportPassengerList from './hooks/useExportPassengerList';

interface Props {
  params: { eventId: string; dailyEventId: string };
}

const Page = ({ params: { eventId, dailyEventId } }: Props) => {
  const {
    data: event,
    isPending: isEventPending,
    isError: isEventError,
    error: eventError,
  } = useGetEvent(eventId);

  const {
    data: routes,
    isPending: isRoutesPending,
    isError: isRoutesError,
    error: routesError,
  } = useGetShuttleRoutesOfDailyEvent(eventId, dailyEventId);

  const {
    mutateAsync: sendShuttleInformation,
    isPending: isSendShuttleInformationPending,
  } = useSendShuttleInformation();

  const sortedRoutes = useMemo(() => {
    if (!routes) {
      return [];
    }

    const shuttleRoutes = routes.filter(
      (r) => !r.name.includes(HANDY_PARTY_PREFIX),
    );
    const sortedShuttleRoutes = shuttleRoutes.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    const handyPartyRoutes = routes.filter((r) =>
      r.name.includes(HANDY_PARTY_PREFIX),
    );
    const sortedHandyPartyRoutes = handyPartyRoutes.sort((a, b) => {
      const aArea = a.name.split('_')[1];
      const bArea = b.name.split('_')[1];
      const aIndex = HANDY_PARTY_ROUTE_AREA.findIndex((area) => area === aArea);
      const bIndex = HANDY_PARTY_ROUTE_AREA.findIndex((area) => area === bArea);
      const aTripType = a.name.split('_')[2];
      if (aIndex === -1) {
        return 1;
      }
      if (bIndex === -1) {
        return -1;
      }
      if (aIndex === bIndex) {
        return aTripType === '행사장행' ? -1 : 1;
      }
      return aIndex < bIndex ? -1 : 1;
    });
    return [...sortedShuttleRoutes, ...sortedHandyPartyRoutes];
  }, [routes]);

  const hasOpenChatUrl = useMemo(() => {
    return event?.dailyEvents.find((d) => d.dailyEventId === dailyEventId)
      ?.metadata?.openChatUrl;
  }, [event, dailyEventId]);

  const shuttleRouteIdList = useMemo(
    () => sortedRoutes.map((r) => r.shuttleRouteId),
    [sortedRoutes],
  );

  const { data: alertRequests } = useGetAlertRequests(shuttleRouteIdList);

  const alertRequestCountMap = useMemo(() => {
    return alertRequests.reduce<Record<string, number>>((acc, curr) => {
      const id = curr.shuttleRouteId;
      acc[id] = (acc[id] ?? 0) + 1;
      return acc;
    }, {});
  }, [alertRequests]);

  const table = useTable({
    data: sortedRoutes,
    columns: getColumns(alertRequestCountMap),
  });

  const dailyEvent = event
    ? event.dailyEvents.find((d) => d.dailyEventId === dailyEventId)
    : null;

  const handleSendShuttleInformationAllDailyEventRoutes = async () => {
    // 핸디팟 노선들은 알림톡을 발송하지 않음.
    const shuttleRoutes = routes.filter(
      (route) => !route.name.includes(HANDY_PARTY_PREFIX),
    );

    const isConfirmed = confirm(
      `핸디팟을 제외한 일자별 노선 전체(${shuttleRoutes.length}개)에 대해 탑승 정보 알림톡을 발송하시겠습니까? 최대 1분이 소요됩니다. 절대 사이트를 끄지 말아주세요.`,
    );
    if (!isConfirmed) {
      return;
    }

    // Promise all 로 할 시 오류 발생
    for (const route of shuttleRoutes) {
      await sendShuttleInformation({
        eventId,
        dailyEventId,
        shuttleRouteId: route.shuttleRouteId,
      });
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    alert(`탑승정보 알림톡 발송 완료`);
  };

  const { exportExcel } = useExportPassengerList({
    eventId,
    dailyEventId,
  });
  const handleExportPassengerList = async () => {
    const excelData = await exportExcel();
    console.log(excelData);
    return excelData;
  };

  useEffect(() => {
    if (event && !dailyEvent) {
      notFound();
    }
  }, [event, dailyEvent]);

  if (isEventError || isRoutesError) {
    return (
      <div>
        Error! event error : {eventError?.message}, or routes error :{' '}
        {routesError?.message}
      </div>
    );
  }

  if (isEventPending || isRoutesPending) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Heading>일자별 행사 상세 정보</Heading>
      {dailyEvent && (
        <Callout>
          <List>
            <List.item title="행사명">
              <BlueLink href={`/events/${eventId}`}>{event.eventName}</BlueLink>
            </List.item>
            <List.item title="장소">{event.eventLocationName}</List.item>
            <List.item title="날짜">
              {formatDateString(dailyEvent.date)}
            </List.item>
            <List.item title="상태">
              {Stringifier.dailyEventStatus(dailyEvent?.status)}
            </List.item>
            <List.item title="공지방링크">
              {hasOpenChatUrl ? (
                <a
                  href={hasOpenChatUrl}
                  target="_blank"
                  className="text-basic-blue-400 underline underline-offset-[3px]"
                >
                  {hasOpenChatUrl}
                </a>
              ) : (
                <span className="text-basic-red-500">
                  없음, 노선을 추가하기 전에 링크를 꼭 추가해주세요.
                </span>
              )}
            </List.item>
          </List>
        </Callout>
      )}
      <div className="flex flex-col">
        <Heading.h2 className="flex items-baseline gap-20">
          노선 목록
          <BlueLink
            href={`${dailyEventId}/routes/new`}
            className="text-14"
            // disabled={!hasOpenChatUrl}
          >
            추가하기
          </BlueLink>
          <button
            className="text-14 text-basic-blue-400 underline underline-offset-[3px]"
            onClick={handleSendShuttleInformationAllDailyEventRoutes}
            disabled={isSendShuttleInformationPending}
          >
            탑승정보 알림톡 발송하기 (일자별 노선 전체)
          </button>
          <EditDailyEventOpenChatUrl
            eventId={eventId}
            dailyEventId={dailyEventId}
            openChatUrl={hasOpenChatUrl}
          />
          <button
            className="text-14 text-basic-blue-400 underline underline-offset-[3px]"
            onClick={handleExportPassengerList}
          >
            탑승자 명단 다운로드
          </button>
        </Heading.h2>
        <div className="mb-12 flex justify-start gap-20 bg-basic-grey-100 px-20 py-12">
          <h5 className="whitespace-nowrap text-14">핸디팟 기능 :</h5>
          <BlueLink
            href={`${dailyEventId}/handy-party/optimizer-paste`}
            className="text-14"
          >
            핸디팟 경로 계산 (엑셀 복붙)
          </BlueLink>
          <BlueLink
            href={`${dailyEventId}/handy-party/optimizer`}
            className="text-14"
          >
            일자별 행사 핸디팟 경로 계산 (엑셀 추출)
          </BlueLink>
          <BlueLink
            href={`${dailyEventId}/handy-party/vehicle-auto-assignment`}
            className="text-14"
          >
            일자별 행사 핸디팟 자동 배차
          </BlueLink>
        </div>
        <BaseTable table={table} />
      </div>
    </main>
  );
};

export default Page;
