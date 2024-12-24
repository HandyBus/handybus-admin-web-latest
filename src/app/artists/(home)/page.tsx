import { AUTH_TOKEN_COOKIE_NAME } from '@/constants/auth';
import { cookies } from 'next/headers';
import { ArtistListSchema } from '@/types/artist.type';
import ArtistsTable from './components/ArtistTable';

async function getArtists() {
  try {
    const token = cookies().get(AUTH_TOKEN_COOKIE_NAME)?.value;

    const response = await fetch(
      new URL('/shuttle-operation/admin/artists', process.env.BASE_URL),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      },
    );

    const json = await response.json();

    return ArtistListSchema.parse(json.artists);
  } catch (e) {
    return Promise.reject(e);
  }
}

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
