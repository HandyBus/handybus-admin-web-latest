'use client';

import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { formatDateString } from '@/utils/date.util';
import { EventsViewEntity } from '@/types/event.type';
import { DEFAULT_EVENT_IMAGE } from '@/constants/common';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<EventsViewEntity>();

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
          <p className="font-400 text-basic-grey-700">{artists}</p>
          <p className="font-400 text-basic-grey-700">{eventType}</p>
          <p className="font-500 text-basic-grey-700">{eventLocationName}</p>
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
                className="flex h-[58px] grow items-center justify-center whitespace-nowrap break-keep border-b border-basic-grey-100 px-8 last:border-b-0"
              >
                {formatDateString(date, 'date')}
              </p>
            ))}
          </div>
        );
      },
    },
  ),
  columnHelper.accessor('eventDetailImageUrl', {
    header: '상세 이미지',
    cell: (info) => {
      const { eventDetailImageUrl } = info.row.original;
      if (!eventDetailImageUrl) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className="relative w-400 p-4">
          <Image
            src={eventDetailImageUrl || DEFAULT_EVENT_IMAGE}
            alt="Event"
            width={400}
            height={0}
            className="h-auto w-full object-contain"
            style={{ height: 'auto' }}
          />
        </div>
      );
    },
  }),
];
