'use client';

import VerticalTable from '@/components/table/VerticalTable';
import useTable from '@/hooks/useTable';
import { columns } from './table.type';
import { UsersViewEntity } from '@/types/user.type';
import Heading from '@/components/text/Heading';
import { useMemo } from 'react';

interface Props {
  user: UsersViewEntity;
}

const UserTable = ({ user }: Props) => {
  const memoizedUser = useMemo(() => [user], [user]);
  const table = useTable({
    data: memoizedUser,
    columns,
  });

  return (
    <section className="flex w-full flex-col">
      <Heading.h2>유저 정보</Heading.h2>
      <VerticalTable table={table} />
    </section>
  );
};

export default UserTable;
