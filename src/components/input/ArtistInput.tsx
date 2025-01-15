'use client';

import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { readArtists } from '@/services/v2/artists.services';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { ArtistsView } from '@/types/v2/artist.type';
import { filterByFuzzy } from '@/utils/fuzzy.util';

interface Props {
  value: number | null;
  setValue: (value: number | null) => void;
}

const ArtistInput = ({ value, setValue }: Props) => {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => await readArtists(),
  });

  const setSelectedArtist = useCallback(
    (artist: ArtistsView) => {
      setValue(artist?.artistId);
    },
    [setValue],
  );

  const selectedArtist = useMemo(
    () => data?.find((artist) => artist.artistId === value) || null,
    [data, value],
  );

  const filtered: ArtistsView[] = useMemo(
    () =>
      query
        ? filterByFuzzy(data ?? [], query, (p) => p.artistName)
        : (data ?? []),
    [data, query],
  );

  if (error) return <div>Failed to load artists</div>;

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
        displayValue={(person: null | ArtistsView) => person?.artistName ?? ''}
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
