'use client';

import DataTable from '@/components/table/DataTable';
import { getArtists } from '@/services/api/artists.services';
import { columns } from './\btypes/table.type';
import { useQuery } from '@tanstack/react-query';

const ArtistPage = () => {
  const {
    data: artists,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['artists'],
    queryFn: getArtists,
  });

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div>
      <h2 className="text-[24px] font-500">아티스트 목록</h2>
      <DataTable data={artists} columns={columns} />
    </div>
  );
};

export default ArtistPage;
