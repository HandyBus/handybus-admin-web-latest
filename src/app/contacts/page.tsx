'use client';

import { columns } from './table.type';
import { LoaderCircleIcon } from 'lucide-react';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import { useGetContacts } from '@/services/contact.service';
import ColumnFilter from '@/components/table/ColumnFilter';
import Heading from '@/components/text/Heading';

const Page = () => {
  return (
    <main>
      <Heading>협업문의 대시보드</Heading>
      <AllContacts />
    </main>
  );
};

export default Page;

const AllContacts = () => {
  const { data, isLoading, isError, error } = useGetContacts();

  const table = useTable({
    columns,
    data: data || [],
    manualFiltering: true,
  });

  if (isLoading) {
    return (
      <section className="flex flex-col">
        <LoaderCircleIcon className="animate-spin" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-col">
        <Heading.h2>모든 문의 조회</Heading.h2>
        <p>에러 : {error?.message || '알 수 없는 오류가 발생했습니다.'}</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col">
      <ColumnFilter table={table} />
      <BaseTable table={table} />
      {(!data || data.length === 0) && <p>데이터가 없습니다.</p>}
    </section>
  );
};
