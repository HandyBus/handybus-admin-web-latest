'use client';

import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getArtists } from '@/services/api/artists.services';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { ArtistType } from '@/types/artist.type';
import { filterByFuzzy } from '@/utils/fuzzy.util';

interface Props {
  value: number | null;
  setValue: (value: number | null) => void;
}

const ArtistInput = ({ value, setValue }: Props) => {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => await getArtists(),
  });

  const setSelectedArtist = useCallback(
    (artist: ArtistType) => {
      setValue(artist?.artistId);
    },
    [setValue],
  );

  const selectedArtist = useMemo(
    () => data?.find((artist) => artist.artistId === value) || null,
    [data, value],
  );

  const filtered: ArtistType[] = useMemo(
    () =>
      query ? filterByFuzzy(data ?? [], query, (p) => p.name) : (data ?? []),
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
        displayValue={(person: null | ArtistType) => person?.name ?? ''}
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
            {artist.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};

export default ArtistInput;
