'use client';

import BaseTable from '@/components/table/BaseTable';
import { columns } from './types/table.type';
import useTable from '@/hooks/useTable';
import { useGetArtists } from '@/services/shuttleOperation.service';
import Heading from '@/components/text/Heading';
import BlueLink from '@/components/link/BlueLink';

const ArtistPage = () => {
  const { data: artists, isPending, isError } = useGetArtists();

  const table = useTable({
    data: artists,
    columns,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <main>
      <Heading className="flex items-baseline gap-20">
        아티스트 대시보드
        <BlueLink href="/artists/new" className="text-14">
          추가하기
        </BlueLink>
      </Heading>
      <BaseTable table={table} />
    </main>
  );
};

export default ArtistPage;
