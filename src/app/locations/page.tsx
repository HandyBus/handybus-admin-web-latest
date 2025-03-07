'use client';

import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import { useMemo } from 'react';
import BlueLink from '@/components/link/BlueLink';
import Heading from '@/components/text/Heading';
import { useGetRegionHubs } from '@/services/hub.service';
import { columns } from './table.type';
import { PAGINATION_LIMIT } from '@/constants/config';
import RegionHubFilter from './components/RegionHubFilter';
import useRegionHubFilter from './hooks/useRegionHubFilter';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

const Page = () => {
  const [option, dispatch] = useRegionHubFilter();
  const {
    data: regionHubs,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useGetRegionHubs({
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

  const { InfiniteScrollTrigger } = useInfiniteScroll({
    fetchNextPage,
    isLoading: isFetching,
    hasNextPage,
  });

  return (
    <main>
      <Heading className="flex items-baseline gap-20">
        장소 대시보드
        <BlueLink href="/locations/new" className="text-14">
          추가하기
        </BlueLink>
      </Heading>
      <section className="flex flex-col">
        <RegionHubFilter option={option} dispatch={dispatch} />
        <BaseTable table={table} />
        <InfiniteScrollTrigger />
      </section>
    </main>
  );
};

export default Page;
