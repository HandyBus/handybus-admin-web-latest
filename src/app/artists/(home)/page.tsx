import DataTable from '@/components/table/DataTable';
import { getArtists } from '@/app/actions/artists.action';
import { columns } from './\btypes/table.type';

const ArtistPage = async () => {
  try {
    const artists = await getArtists();
    return (
      <div>
        <h2 className="text-[24px] font-500">아티스트 목록</h2>
        <DataTable data={artists} columns={columns} />
      </div>
    );
  } catch (e) {
    return JSON.stringify(e);
  }
};

export default ArtistPage;
