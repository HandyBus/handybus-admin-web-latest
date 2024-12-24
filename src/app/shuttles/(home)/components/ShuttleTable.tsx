'use client';
import { type ShuttleType } from '@/types/shuttle.type';
import { useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { getCoreRowModel } from '@tanstack/react-table';
import Image from 'next/image';
import BlueLink from '@/components/link/BlueLink';

interface Props {
  shuttles: ShuttleType[];
}

const ShuttleTable = ({ shuttles }: Props) => {
  const [data] = useState([...shuttles]);

  // Columns and data are defined in a stable reference, will not cause infinite loop!
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="text-sm w-full border-separate border-spacing-y-8 text-left text-grey-900 rtl:text-right">
      <thead className="text-xs bg-grey-50 uppercase text-grey-700">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="
          border-spacing-y-40 rounded-lg border border-b border-grey-50 bg-white transition-colors hover:bg-grey-50"
          >
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border-y border-r border-grey-100 p-8 first:rounded-l-lg first:border-l last:rounded-r-lg"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="border-spacing-y-40 rounded-lg border border-b border-grey-50 bg-white transition-colors hover:bg-grey-50"
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="border-y border-r border-grey-100 p-8 first:rounded-l-lg first:border-l last:rounded-r-lg"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShuttleTable;

const columnHelper = createColumnHelper<ShuttleType>();

const columns = [
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
