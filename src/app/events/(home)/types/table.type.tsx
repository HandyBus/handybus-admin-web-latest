'use client';

import type { EventsViewType } from '@/types/v2/event.type';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<EventsViewType>();

export const columns = [
  columnHelper.accessor('eventId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'image',
    header: () => '포스터',
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
  columnHelper.accessor('eventName', {
    header: () => '이벤트 이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('eventLocationName', {
    header: () => '장소',
    cell: (info) => info.getValue(),
  }),
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
    header: () => '액션',
    cell: (props) => (
      <BlueLink href={`/events/${props.row.original.eventId}`}>
        자세히 보기
      </BlueLink>
    ),
  }),
];
