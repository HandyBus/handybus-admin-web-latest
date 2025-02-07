'use client';

import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import { useMemo } from 'react';
import BlueLink from '@/components/link/BlueLink';
import Heading from '@/components/text/Heading';
import { useGetRegionHubs } from '@/services/location.service';
import { columns } from './table.type';
import { PAGINATION_LIMIT } from '@/constants/config';
import RegionHubFilter from './components/RegionHubFilter';
import useRegionHubFilter from './hooks/useRegionHubFilter';

const Page = () => {
  const [option, dispatch] = useRegionHubFilter();
  const { data: regionHubs } = useGetRegionHubs({
    options: {
      ...option,
      page: undefined,
      limit: PAGINATION_LIMIT,
    },
  });

  const flattenedRegionHubs = useMemo(
    () => regionHubs?.pages.flatMap((page) => page.regionHubs),
    [regionHubs],
  );

  const table = useTable({
    data: flattenedRegionHubs,
    columns,
    manualFiltering: true,
  });

  return (
    <main>
      <Heading className="flex items-baseline gap-20">
        거점지 대시보드
        <BlueLink href="/hubs/new" className="text-14">
          추가하기
        </BlueLink>
      </Heading>
      <section className="flex flex-col">
        <RegionHubFilter option={option} dispatch={dispatch} />
        <BaseTable table={table} />
      </section>
    </main>
  );
};

export default Page;
