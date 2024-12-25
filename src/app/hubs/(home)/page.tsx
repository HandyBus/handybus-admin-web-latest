'use client';

import DataTable from '@/components/table/DataTable';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getHubs } from '@/app/actions/hub.action';
import RegionInput from '@/components/input/RegionInput';
import BlueLink from '@/components/link/BlueLink';
import { columns } from './table.type';

const Page = () => {
  const [regionId, setRegionId] = useState<number | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['hubs', regionId],
    queryFn: async () =>
      regionId === null
        ? Promise.reject('choose region')
        : await getHubs(regionId),
    enabled: regionId !== null,
  });

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between items-center">
        <h1 className="text-[32px] font-500">거점지 대시보드</h1>
        <BlueLink href="/hubs/new">거점지 추가</BlueLink>
      </header>
      <div>
        <RegionInput value={regionId} setValue={setRegionId} />
        {regionId === null ? <p>지역을 선택하세요.</p> : null}
        {isLoading ? <p>로딩 중...</p> : null}
        {isError ? <p>에러 : {error.message}</p> : null}
        {data ? <DataTable data={data} columns={columns} /> : null}
        {data?.length === 0 ? <p>이 지역에 거점지가 없습니다.</p> : null}
      </div>
    </main>
  );
};

export default Page;
