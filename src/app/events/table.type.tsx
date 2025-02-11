'use client';

import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { formatDateString } from '@/utils/date.util';
import { EventDashboardReadModel } from '@/types/event.type';
import { DEFAULT_EVENT_IMAGE } from '@/constants/common';
import Stringifier from '@/utils/stringifier.util';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<EventDashboardReadModel>();

export const columns = [
  columnHelper.display({
    id: 'image',
    header: '포스터',
    cell: (props) => (
      <div className="relative m-4 h-112 w-100">
        <Image
          src={props.row.original.eventImageUrl || DEFAULT_EVENT_IMAGE}
          alt="Event"
          fill
          className="object-contain"
        />
      </div>
    ),
  }),
  columnHelper.accessor('eventName', {
    id: 'eventName',
    header: '행사 정보',
    cell: (info) => {
      const { eventName, eventLocationName, eventType, eventArtists } =
        info.row.original;
      const artists = eventArtists
        ?.map((artist) => artist.artistName)
        .join(', ');
      return (
        <div className="flex flex-col p-8 text-16">
          <p className="font-700">{eventName}</p>
          <p className="font-400 text-grey-700">{artists}</p>
          <p className="font-400 text-grey-700">{eventType}</p>
          <p className="font-500 text-grey-800">{eventLocationName}</p>
        </div>
      );
    },
  }),
  columnHelper.accessor(
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.date),
    {
      header: '날짜',
      cell: ({ getValue }) => {
        const dates: string[] = getValue();
        return (
          <div className="flex h-full flex-col justify-between">
            {dates.map((date) => (
              <p
                key={date}
                className="flex h-56 grow items-center justify-center whitespace-nowrap break-keep border-b border-grey-200 px-8 last:border-b-0"
              >
                {formatDateString(date, 'date')}
              </p>
            ))}
          </div>
        );
      },
    },
  ),
  columnHelper.accessor(
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.status),
    {
      header: '수요조사 상태',
      cell: (info) => {
        const eventStatuses = info.getValue();
        const statistics = info.row.original.dailyEvents.map(
          (dailyEvent) => dailyEvent.statistics,
        );
        return (
          <div className="flex h-full flex-col justify-between">
            {eventStatuses.map((eventStatus, index) => (
              <p
                key={index}
                className="group relative flex h-56 grow items-center justify-center whitespace-nowrap  break-keep border-b border-grey-200 px-8 last:border-b-0"
              >
                {Stringifier.eventStatus(eventStatus)}
                <div className="absolute left-100 hidden h-120 w-172 rounded-[4px] bg-black/65 p-12 text-white group-hover:block">
                  <p>총 수요조사 수: {statistics[index].totalCount}</p>
                  <p>왕복: {statistics[index].roundTripCount}</p>
                  <p>가는 편: {statistics[index].toDestinationCount}</p>
                  <p>오는 편: {statistics[index].fromDestinationCount}</p>
                </div>
              </p>
            ))}
          </div>
        );
      },
    },
  ),
  columnHelper.accessor(
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.dailyEventId),
    {
      header: '수요조사 상세',
      cell: async (info) => {
        const dailyEventIds = info.getValue();
        const eventId = info.row.original.eventId;
        return (
          <div className="flex h-full flex-col justify-between">
            {dailyEventIds.map((dailyEventId) => (
              <p
                key={dailyEventId}
                className="flex h-56 grow items-center justify-center whitespace-nowrap break-keep border-b border-grey-200 px-8 last:border-b-0"
              >
                <BlueLink href={`/events/${eventId}/dates/${dailyEventId}`}>
                  수요조사 보기
                </BlueLink>
              </p>
            ))}
          </div>
        );
      },
    },
  ),
  columnHelper.accessor(
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.expectedRouteCount),
    {
      header: '추천 노선 수',
      cell: (info) => {
        const expectedRouteCounts = info.getValue();
        return (
          <div className="flex h-full flex-col justify-between">
            {expectedRouteCounts.map((expectedRouteCount, index) => (
              <p
                key={index}
                className="flex h-56 grow items-center justify-center whitespace-nowrap break-keep border-b border-grey-200 px-8 last:border-b-0"
              >
                {expectedRouteCount}
              </p>
            ))}
          </div>
        );
      },
    },
  ),
  columnHelper.accessor(
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.openedRouteCount),
    {
      header: '개설된 노선 수',
      cell: (info) => {
        const openedRouteCounts = info.getValue();
        return (
          <div className="flex h-full flex-col justify-between">
            {openedRouteCounts.map((openedRouteCount, index) => (
              <p
                key={index}
                className="flex h-56 grow items-center justify-center whitespace-nowrap break-keep border-b border-grey-200 px-8 last:border-b-0"
              >
                {openedRouteCount}
              </p>
            ))}
          </div>
        );
      },
    },
  ),
  columnHelper.accessor(
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.dailyEventId),
    {
      header: '노선 상세',
      cell: (info) => {
        const dailyEventIds = info.getValue();
        const eventId = info.row.original.eventId;
        const openedRouteCount = info.row.original.dailyEvents.map(
          (dailyEvent) => dailyEvent.openedRouteCount,
        );

        return (
          <div className="flex h-full flex-col justify-between">
            {dailyEventIds.map((dailyEventId, index) => (
              <p
                key={dailyEventId}
                className="flex h-56 grow items-center justify-center border-b border-grey-200 px-8 last:border-b-0"
              >
                {openedRouteCount[index] > 0 ? (
                  <BlueLink href={`/events/${eventId}/dates/${dailyEventId}`}>
                    노선 보기
                  </BlueLink>
                ) : (
                  <BlueLink
                    href={`/events/${eventId}/dates/${dailyEventId}/routes/new`}
                  >
                    추가하기
                  </BlueLink>
                )}
              </p>
            ))}
          </div>
        );
      },
    },
  ),
];
