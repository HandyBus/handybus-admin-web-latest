'use client';

import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { formatDateString } from '@/utils/date.util';
import { EventWithStatisticsViewEntity } from '@/types/event.type';
import { DEFAULT_EVENT_IMAGE } from '@/constants/common';
import Stringifier from '@/utils/stringifier.util';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<EventWithStatisticsViewEntity>();

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
    header: '행사 정보',
    cell: (info) => {
      const { eventName, eventLocationName, eventType, eventArtists, eventId } =
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
          <BlueLink href={`/events/${eventId}/edit`} className="text-12">
            수정하기
          </BlueLink>
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
            {dates.map((date, index) => (
              <p
                key={index}
                className="flex h-[58px] grow items-center justify-center whitespace-nowrap break-keep border-b border-grey-100 px-8 last:border-b-0"
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
      header: '상태',
      cell: (info) => {
        const eventStatuses = info.getValue();
        const statistics = info.row.original.dailyEvents.map((dailyEvent) => {
          return {
            totalCount: dailyEvent.totalDemandCount,
            roundTripCount: dailyEvent.roundTripDemandCount,
            toDestinationCount: dailyEvent.toDestinationDemandCount,
            fromDestinationCount: dailyEvent.fromDestinationDemandCount,
          };
        });
        const style = {
          OPEN: 'text-green-600',
          CLOSED: 'text-grey-700',
          ENDED: 'text-grey-600',
          INACTIVE: 'text-grey-600',
        };
        return (
          <div className="flex h-full flex-col justify-between">
            {eventStatuses.map((eventStatus, index) => (
              <div
                key={index}
                className={`group relative flex h-[58px] grow items-center justify-center whitespace-nowrap  break-keep border-b border-grey-100 px-8 last:border-b-0 ${style[eventStatus]}`}
              >
                {Stringifier.eventStatus(eventStatus)}
                <div className="absolute right-112 hidden h-120 w-172 rounded-[4px] bg-black/65 p-12 text-white group-hover:block">
                  <p>총 수요조사 수: {statistics[index].totalCount}</p>
                  <p>왕복: {statistics[index].roundTripCount}</p>
                  <p>가는 편: {statistics[index].toDestinationCount}</p>
                  <p>오는 편: {statistics[index].fromDestinationCount}</p>
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
  ),
  columnHelper.accessor(
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.dailyEventId),
    {
      header: '수요조사',
      cell: (info) => {
        const dailyEventIds = info.getValue();
        const eventId = info.row.original.eventId;
        const totalCounts = info.row.original.dailyEvents.map((dailyEvent) => {
          return dailyEvent.totalDemandCount;
        });
        return (
          <div className="flex h-full flex-col justify-between">
            {dailyEventIds.map((dailyEventId, index) => (
              <p
                key={dailyEventId}
                className="flex h-[58px] grow items-center justify-center whitespace-nowrap break-keep border-b border-grey-100 px-8 last:border-b-0"
              >
                <BlueLink
                  href={`/events/${eventId}/dates/${dailyEventId}/demands`}
                >
                  상세 ({totalCounts[index]})
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
                className="flex h-[58px] grow items-center justify-center whitespace-nowrap break-keep border-b border-grey-100 px-8 font-500 last:border-b-0"
              >
                {expectedRouteCount}
              </p>
            ))}
          </div>
        );
      },
    },
  ),
  columnHelper.accessor((row) => row.dailyEvents, {
    header: '개설된 노선 수',
    cell: (info) => {
      const dailyEvents = info.getValue();
      const shuttleRouteCounts = dailyEvents.map(
        (dailyEvent) => dailyEvent.shuttleRouteCount,
      );
      const expectedRouteCounts = dailyEvents.map(
        (dailyEvent) => dailyEvent.expectedRouteCount,
      );
      return (
        <div className="flex h-full flex-col justify-between">
          {shuttleRouteCounts.map((shuttleRouteCount, index) => (
            <p
              key={index}
              className={`flex h-[58px] grow items-center justify-center whitespace-nowrap break-keep border-b border-grey-100 px-8 font-600 last:border-b-0 ${
                shuttleRouteCount < expectedRouteCounts[index]
                  ? 'text-red-500'
                  : 'text-green-600'
              }`}
            >
              {shuttleRouteCount}
            </p>
          ))}
        </div>
      );
    },
  }),
  columnHelper.accessor(
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.dailyEventId),
    {
      header: '노선 상세',
      cell: (info) => {
        const dailyEventIds = info.getValue();
        const eventId = info.row.original.eventId;
        const shuttleRouteCount = info.row.original.dailyEvents.map(
          (dailyEvent) => dailyEvent.shuttleRouteCount,
        );

        return (
          <div className="flex h-full flex-col justify-between">
            {dailyEventIds.map((dailyEventId, index) => (
              <p
                key={dailyEventId}
                className="flex h-[58px] grow items-center justify-center border-b border-grey-100 px-8 last:border-b-0"
              >
                {shuttleRouteCount[index] > 0 ? (
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
