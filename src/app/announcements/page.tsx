'use client';

import BaseTable from '@/components/table/BaseTable';
import Heading from '@/components/text/Heading';
import useTable from '@/hooks/useTable';
import { columns } from './table.type';
import BlueLink from '@/components/link/BlueLink';
import { useGetAnnouncements } from '@/services/core.service';
import AnnouncementFilter from './components/AnnouncementFilter';
import { useAnnouncementFilter } from './hooks/useAnnouncementFilter';
import { useMemo } from 'react';

const AnnouncementPage = () => {
  const [option, dispatch] = useAnnouncementFilter({
    withDeleted: undefined,
  });
  const { data: announcements } = useGetAnnouncements({
    withDeleted: option.withDeleted,
  });
  const announcementsSorted = useMemo(() => {
    return announcements?.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [announcements]);
  const table = useTable({
    columns,
    data: announcementsSorted,
    manualFiltering: true,
  });

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-baseline gap-20">
        <Heading>공지사항 대시보드</Heading>
        <BlueLink href="/announcements/new" className="text-14">
          작성하기
        </BlueLink>
      </div>
      <AnnouncementFilter option={option} dispatch={dispatch} />
      <BaseTable table={table} />
    </main>
  );
};

export default AnnouncementPage;
