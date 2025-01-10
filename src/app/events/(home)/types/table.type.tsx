'use client';

import type { EventsViewType } from '@/types/v2/event.type';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<EventsViewType>();

export const columns = [
  columnHelper.accessor('eventId', {
    id: 'eventId',
    header: '이벤트 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'image',
    header: '포스터',
    cell: (props) => (
      <Image
        src={props.row.original.eventImageUrl}
        alt="Event"
        width={40}
        height={55}
        className="overflow-hidden"
      />
    ),
    size: 40,
    minSize: 40, //enforced during column resizing
    maxSize: 40, //enforced during column resizing
  }),
  columnHelper.accessor('eventStatus', {
    id: 'eventStatus',
    header: '이벤트 상태',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('regionId', {
    id: 'regionId',
    header: '지역',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('regionHubId', {
    id: 'regionHubId',
    header: '거점지',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('eventType', {
    id: 'eventType',
    header: '이벤트 종류',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('eventName', {
    id: 'eventName',
    header: '이벤트 이름',
    cell: (info) => info.getValue(),
  }),
  // Accessor Column
  columnHelper.accessor('eventLocationName', {
    id: 'eventLocationName',
    header: '이벤트 장소 이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('eventLocationAddress', {
    id: 'eventLocationAddress',
    header: '이벤트 장소 주소',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor(
    (e) =>
      `(${e.eventLocationLatitude.toFixed(2)}… , ${e.eventLocationLongitude.toFixed(2)}…)`,
    {
      id: 'eventCoord',
      header: '이벤트 장소 좌표',
      cell: (info) => info.getValue(),
    },
  ),
  columnHelper.accessor((row) => row.dailyEvents.map((de) => de.date), {
    header: '날짜',
    cell: ({ getValue }) => {
      const dates: Date[] = getValue();
      return (
        <div>
          {dates.map((date, index) => (
            <div key={index}>{date.toLocaleDateString('ko-KR')}</div>
          ))}
        </div>
      );
    },
  }),
  // TODO remove option chaining '?' after fixing the api
  columnHelper.accessor((row) => row.eventArtists?.map((p) => p.artistName), {
    id: 'artists',
    header: '출연자',
    cell: (info) => {
      const ps: string[] = info.getValue() || [];
      return (
        <div>
          {ps.map((p) => (
            <div key={p}>{p}</div>
          ))}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'actions  ',
    header: '액션',
    cell: (props) => (
      <BlueLink href={`/events/${props.row.original.eventId}`}>
        자세히 보기
      </BlueLink>
    ),
  }),
];
