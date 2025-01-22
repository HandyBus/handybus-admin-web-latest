'use client';

import BaseTable from '@/components/table/BaseTable';
import { columns } from './types/table.type';
import useTable from '@/hooks/useTable';
import { useGetArtists } from '@/services/shuttleOperation.service';

const ArtistPage = () => {
  const { data: artists, isPending, isError } = useGetArtists();

  const table = useTable({
    data: artists,
    columns,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <h2 className="text-[24px] font-500">아티스트 목록</h2>
      <BaseTable table={table} />
    </div>
  );
};

export default ArtistPage;
