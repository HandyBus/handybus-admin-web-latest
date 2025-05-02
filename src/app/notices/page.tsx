'use client';

import BaseTable from '@/components/table/BaseTable';
import Heading from '@/components/text/Heading';
import useTable from '@/hooks/useTable';
import { columns } from './table.type';
import BlueLink from '@/components/link/BlueLink';
import { useGetAnnouncements } from '@/services/core.service';
import NoticeFilter from './components/NoticeFilter';
import { useNoticeFilter } from './hooks/useNoticeFilter';

const NoticePage = () => {
  const [option, dispatch] = useNoticeFilter({
    withDeleted: undefined,
  });
  const { data: announcements } = useGetAnnouncements({
    withDeleted: option.withDeleted,
  });
  const table = useTable({
    columns,
    data: announcements,
    manualFiltering: true,
  });

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-baseline gap-20">
        <Heading>공지사항 대시보드</Heading>
        <BlueLink href="/notices/new" className="text-14">
          작성하기
        </BlueLink>
      </div>
      <NoticeFilter option={option} dispatch={dispatch} />
      <BaseTable table={table} />
    </main>
  );
};

export default NoticePage;
