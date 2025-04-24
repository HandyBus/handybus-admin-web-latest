'use client';

import BaseTable from '@/components/table/BaseTable';
import Heading from '@/components/text/Heading';
import useTable from '@/hooks/useTable';
import { columns } from './table.type';
import BlueLink from '@/components/link/BlueLink';

const MOCK_DATA = [
  {
    id: 1,
    title: '공지사항 1',
    content: '공지사항 1 내용',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    title: '공지사항 2',
    content: '공지사항 2 내용',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 3,
    title: '공지사항 3',
    content: '공지사항 3 내용',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 4,
    title: '공지사항 4',
    content: '공지사항 4 내용',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const NoticePage = () => {
  const table = useTable({
    columns,
    data: MOCK_DATA,
  });

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-baseline gap-20">
        <Heading>공지사항 대시보드</Heading>
        <BlueLink href="/notices/new" className="text-14">
          작성하기
        </BlueLink>
      </div>
      <BaseTable table={table} />
    </main>
  );
};

export default NoticePage;
