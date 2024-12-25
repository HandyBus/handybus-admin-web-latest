'use client';

import { type ShuttleType } from '@/types/shuttle.type';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<ShuttleType>();

export const columns = [
  columnHelper.accessor('shuttleId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'image',
    header: () => '포스터',
    cell: (props) => (
      <Image
        src={props.row.original.image}
        alt="Shuttle"
        width={40}
        height={55}
        className="overflow-hidden"
      />
    ),
    size: 40,
    minSize: 40, //enforced during column resizing
    maxSize: 40, //enforced during column resizing
  }),
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('destination', {
    header: () => '장소',
    cell: (info) => info.getValue().name,
  }),
  columnHelper.accessor((row) => row.dailyShuttles.map((ds) => ds.date), {
    header: '날짜',
    cell: ({ getValue }) => {
      const dates: Date[] = getValue();
      return (
        <div>
          {dates.map((date, index) => (
            <div key={index}>{date.toLocaleDateString()}</div>
          ))}
        </div>
      );
    },
  }),
  columnHelper.accessor((row) => row.participants.map((p) => p.name), {
    header: '출연자',
    cell: (info) => {
      const ps: string[] = info.getValue();
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
      <BlueLink href={`/shuttles/${props.row.original.shuttleId}`}>
        자세히 보기
      </BlueLink>
    ),
  }),
];
