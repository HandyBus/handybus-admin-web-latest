'use client';

import BaseTable from '@/components/table/BaseTable';
import { getArtists } from '@/services/v2/artists.services';
import { columns } from './types/table.type';
import { useQuery } from '@tanstack/react-query';
import useTable from '@/hooks/useTable';

const ArtistPage = () => {
  const {
    data: artists,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['artists'],
    queryFn: () => getArtists(),
  });

  const table = useTable({
    data: artists ?? [],
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
