'use client';

import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import BlueLink from '@/components/link/BlueLink';
import { notFound } from 'next/navigation';
import { getColumns } from './table.type';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { HANDY_PARTY_ROUTE_AREA } from '@/constants/handyPartyArea.const';
import useExportPassengerList from './hooks/useExportPassengerList';
import useExportHandyPartyPassengerList from './hooks/useExportHandyPartyPassengerList';
import useCloseMultipleShuttleRoutes from './hooks/useCloseMultipleShuttleRoutes';
import BlueButton from '@/components/link/BlueButton';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import ChangeReservationDeadlineDialog from './components/ChangeReservationDeadlineDialog';
import ChangeMaxPassengerCountDialog from './components/ChangeMaxPassengerCountDialog';

const SHUTTEL_ROUTE_ORDER = [
  '서울',
  '경기',
  '인천',
  '대전',
  '대구',
  '광주',
  '부산',
  '경남',
  '경북',
  '충남',
  '충북',
  '전남',
  '전북',
  '강원',
  '울산',
  '제주',
  '세종',
] as const;

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

  const sortedRoutes = useMemo(() => {
    if (!routes) {
      return [];
    }

    const shuttleRoutes = routes.filter((r) => !r.isHandyParty);
    const sortedShuttleRoutes = shuttleRoutes.sort((a, b) => {
      const aArea = a.name.split('_')[0];
      const bArea = b.name.split('_')[0];
      const aIndex = SHUTTEL_ROUTE_ORDER.findIndex((area) => area === aArea);
      const bIndex = SHUTTEL_ROUTE_ORDER.findIndex((area) => area === bArea);
      if (aIndex === -1) {
        return 1;
      }
      if (bIndex === -1) {
        return -1;
      }
      return aIndex < bIndex ? -1 : 1;
    });

    const handyPartyRoutes = routes.filter((r) => r.isHandyParty);
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

  const [selectedShuttleRoutes, setSelectedShuttleRoutes] = useState<
    AdminShuttleRoutesViewEntity[]
  >([]);
  const handleSelectShuttleRoute = useCallback(
    (shuttleRoute: AdminShuttleRoutesViewEntity, isChecked: boolean) => {
      if (isChecked) {
        setSelectedShuttleRoutes([...selectedShuttleRoutes, shuttleRoute]);
      } else {
        setSelectedShuttleRoutes(
          selectedShuttleRoutes.filter(
            (r) => r.shuttleRouteId !== shuttleRoute.shuttleRouteId,
          ),
        );
      }
    },
    [selectedShuttleRoutes],
  );
  const handleSelectAllShuttleRoutes = useCallback(
    (isChecked: boolean) => {
      if (isChecked) {
        setSelectedShuttleRoutes(sortedRoutes);
      } else {
        setSelectedShuttleRoutes([]);
      }
    },
    [sortedRoutes],
  );
  const clearSelectedShuttleRoutes = useCallback(() => {
    setSelectedShuttleRoutes([]);
  }, []);

  const columns = useMemo(
    () =>
      getColumns({
        selectedShuttleRoutes,
        onSelectShuttleRoute: handleSelectShuttleRoute,
        onSelectAll: handleSelectAllShuttleRoutes,
        alertRequestCounts: alertRequestCountMap,
      }),
    [
      selectedShuttleRoutes,
      handleSelectShuttleRoute,
      handleSelectAllShuttleRoutes,
      alertRequestCountMap,
    ],
  );

  const table = useTable({
    data: sortedRoutes,
    columns,
  });

  const dailyEvent = event
    ? event.dailyEvents.find((d) => d.dailyEventId === dailyEventId)
    : null;

  const { exportExcel } = useExportPassengerList({
    eventId,
    dailyEventId,
  });
  const handleExportPassengerList = async () => {
    const excelData = await exportExcel();
    return excelData;
  };

  const { exportExcel: exportHandyPartyPassengerList } =
    useExportHandyPartyPassengerList({
      eventId,
      dailyEventId,
    });
  const handleExportHandyPartyPassengerList = async () => {
    const excelData = await exportHandyPartyPassengerList();
    return excelData;
  };

  const { closeMultipleShuttleRoutes } = useCloseMultipleShuttleRoutes();
  const handleCloseSelectedShuttleRoutes = async () => {
    const shuttleRouteIdList = selectedShuttleRoutes.map(
      (r) => r.shuttleRouteId,
    );

    await closeMultipleShuttleRoutes({
      eventId,
      dailyEventId,
      shuttleRouteIds: shuttleRouteIdList,
    });
    clearSelectedShuttleRoutes();
  };
  const handleCloseHandyPartyRoutes = async () => {
    const handyPartyRouteIdList = sortedRoutes
      .filter((r) => r.isHandyParty)
      .map((r) => r.shuttleRouteId);

    await closeMultipleShuttleRoutes({
      eventId,
      dailyEventId,
      shuttleRouteIds: handyPartyRouteIdList,
    });
    clearSelectedShuttleRoutes();
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
              {formatDateString(dailyEvent.dailyEventDate)}
            </List.item>
            <List.item title="상태">
              {Stringifier.dailyEventStatus(dailyEvent?.dailyEventStatus)}
            </List.item>
          </List>
        </Callout>
      )}
      <div className="flex flex-col">
        <Heading.h2 className="flex items-baseline gap-20">
          노선 목록
          <BlueLink href={`${dailyEventId}/routes/new`} className="text-14">
            추가하기
          </BlueLink>
          <button
            className="text-14 text-basic-blue-400 underline underline-offset-[3px]"
            onClick={handleExportPassengerList}
          >
            셔틀 명단 다운로드
          </button>
          <button
            className="text-14 text-basic-blue-400 underline underline-offset-[3px]"
            onClick={handleExportHandyPartyPassengerList}
          >
            핸디팟 명단 다운로드
          </button>
        </Heading.h2>
        <div className="mb-12 flex flex-wrap gap-20 bg-basic-grey-100 px-20 py-12">
          <BlueButton
            onClick={handleCloseSelectedShuttleRoutes}
            disabled={selectedShuttleRoutes.length === 0}
            className="text-14"
          >
            선택한 노선 예약 마감하기
          </BlueButton>
          <ChangeReservationDeadlineDialog
            eventId={eventId}
            dailyEventId={dailyEventId}
            selectedShuttleRoutes={selectedShuttleRoutes}
            clearSelectedShuttleRoutes={clearSelectedShuttleRoutes}
          />
          <ChangeMaxPassengerCountDialog
            eventId={eventId}
            dailyEventId={dailyEventId}
            selectedShuttleRoutes={selectedShuttleRoutes}
            clearSelectedShuttleRoutes={clearSelectedShuttleRoutes}
          />
        </div>
        <div className="mb-12 flex flex-wrap gap-20 bg-basic-grey-100 px-20 py-12">
          <h5 className="whitespace-nowrap text-14 font-600">핸디팟 기능 :</h5>
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
          <BlueButton onClick={handleCloseHandyPartyRoutes} className="text-14">
            핸디팟 일괄 예약 마감
          </BlueButton>
        </div>
        <BaseTable table={table} />
      </div>
    </main>
  );
};

export default Page;
