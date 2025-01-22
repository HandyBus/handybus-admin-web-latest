'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { filterByFuzzy } from '@/utils/fuzzy.util';
import { useGetArtists } from '@/services/shuttleOperation.service';
import { ArtistsViewEntity } from '@/types/artist.type';

interface Props {
  value: number | null;
  setValue: (value: number | null) => void;
}

const ArtistInput = ({ value, setValue }: Props) => {
  const [query, setQuery] = useState('');
  const { data, isError, isLoading } = useGetArtists();

  const setSelectedArtist = useCallback(
    (artist: ArtistsViewEntity) => {
      setValue(artist?.artistId);
    },
    [setValue],
  );

  const selectedArtist = useMemo(
    () => data?.find((artist) => artist.artistId === value) || null,
    [data, value],
  );

  const filtered: ArtistsViewEntity[] = useMemo(
    () =>
      query
        ? filterByFuzzy(data ?? [], query, (p) => p.artistName)
        : (data ?? []),
    [data, query],
  );

  if (isError) return <div>Failed to load artists</div>;

  return (
    <Combobox
      immediate
      value={selectedArtist}
      onChange={setSelectedArtist}
      onClose={() => setQuery('')}
    >
      <ComboboxInput
        className="p-8 border border-grey-200 rounded-lg focus:outline-blue-400"
        aria-label="Assignee"
        placeholder={isLoading ? '로딩 중…' : '아티스트 선택'}
        defaultValue={null}
        displayValue={(person: null | ArtistsViewEntity) =>
          person?.artistName ?? ''
        }
        onChange={(event) => setQuery(event.target.value)}
      />

      <ComboboxOptions
        anchor="bottom"
        className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
      >
        {filtered.map((artist) => (
          <ComboboxOption
            key={artist.artistId}
            value={artist}
            className="data-[focus]:bg-blue-100 p-8"
          >
            {artist.artistName}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};

export default ArtistInput;
