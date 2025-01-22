'use client';

import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';

import { useState } from 'react';
import RegionInput from '@/components/input/RegionInput';
import BlueLink from '@/components/link/BlueLink';
import { columns } from './types/table.type';
import { useGetRegionHubs } from '@/services/location.service';

const Page = () => {
  const [regionId, setRegionId] = useState<number | null>(null);

  const { data, isLoading, isError, error } = useGetRegionHubs(regionId ?? 0);

  const table = useTable({ data, columns });

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between items-center">
        <h1 className="text-[32px] font-500">거점지 대시보드</h1>
        <BlueLink href="/hubs/new">거점지 추가</BlueLink>
      </header>
      <div>
        <RegionInput value={regionId} setValue={setRegionId} />
        {regionId === null ? <p>지역을 선택하세요.</p> : null}
        {data ? <BaseTable table={table} /> : null}
        {isLoading ? <p>로딩 중...</p> : null}
        {isError ? <p>에러 : {error.message}</p> : null}
        {data && data.length === 0 ? <p>이 지역에 거점지가 없습니다.</p> : null}
      </div>
    </main>
  );
};

export default Page;
