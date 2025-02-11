'use client';

import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { formatDateString } from '@/utils/date.util';
import { EventsViewEntity } from '@/types/event.type';
import { DEFAULT_EVENT_IMAGE } from '@/constants/common';
import Stringifier from '@/utils/stringifier.util';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<EventsViewEntity>();

export const columns = [
  columnHelper.display({
    id: 'image',
    header: '포스터',
    cell: (props) => (
      <div className="w-55 relative m-4 h-full">
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
          <p className="font-500">{artists}</p>
          <p className="font-500">{eventType}</p>
          <p className="font-400">{eventLocationName}</p>
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
                className="flex grow items-center justify-center border-b border-grey-200 last:border-b-0"
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
      cell: ({ getValue }) => {
        const eventStatuses = getValue();
        return (
          <div className="flex h-full flex-col justify-between">
            {eventStatuses.map((eventStatus, index) => (
              <p
                key={index}
                className="flex grow items-center justify-center border-b border-grey-200 last:border-b-0"
              >
                {Stringifier.eventStatus(eventStatus)}
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
                className="flex grow items-center justify-center border-b border-grey-200 last:border-b-0"
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
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.dailyEventId),
    {
      header: '추천 노선 수',
      cell: (info) => {
        const dailyEventIds = info.getValue();
        const eventId = info.row.original.eventId;
        return (
          <div className="flex h-full flex-col justify-between">
            {dailyEventIds.map((dailyEventId) => (
              <p
                key={dailyEventId}
                className="flex grow items-center justify-center border-b border-grey-200 last:border-b-0"
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
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.dailyEventId),
    {
      header: '개설된 노선 수',
      cell: (info) => {
        const dailyEventIds = info.getValue();
        const eventId = info.row.original.eventId;
        return (
          <div className="flex h-full flex-col justify-between">
            {dailyEventIds.map((dailyEventId) => (
              <p
                key={dailyEventId}
                className="flex grow items-center justify-center border-b border-grey-200 last:border-b-0"
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
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.dailyEventId),
    {
      header: '노선 상세',
      cell: (info) => {
        const dailyEventIds = info.getValue();
        const eventId = info.row.original.eventId;
        return (
          <div className="flex h-full flex-col justify-between">
            {dailyEventIds.map((dailyEventId) => (
              <p
                key={dailyEventId}
                className="flex grow items-center justify-center border-b border-grey-200 last:border-b-0"
              >
                <BlueLink href={`/events/${eventId}/dates/${dailyEventId}`}>
                  노선 보기
                </BlueLink>
              </p>
            ))}
          </div>
        );
      },
    },
  ),
];
