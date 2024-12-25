import ArtistsTable from './components/ArtistTable';
import { getArtists } from '@/app/actions/artists.action';

const ArtistPage = async () => {
  try {
    const artists = await getArtists();
    return (
      <div>
        <h2 className="text-[24px] font-500">아티스트 목록</h2>
        <ArtistsTable artists={artists} />
      </div>
    );
  } catch (e) {
    return JSON.stringify(e);
  }
};

export default ArtistPage;
