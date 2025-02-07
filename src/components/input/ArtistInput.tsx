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
import Link from 'next/link';

interface Props {
  value: string | null;
  setValue: (value: string | null) => void;
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
        className="rounded-lg border border-grey-200 p-8 focus:outline-blue-400"
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
        className="mt-4 w-[var(--input-width)] rounded-lg bg-white shadow-md empty:invisible"
      >
        {filtered.map((artist) => (
          <ComboboxOption
            key={artist.artistId}
            value={artist}
            className="p-8 data-[focus]:bg-blue-100"
          >
            {artist.artistName}
          </ComboboxOption>
        ))}
        {!isLoading && (
          <Link
            href="/artists/new"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-8 text-blue-500 hover:bg-blue-100"
          >
            + 새로운 아티스트 만들기
          </Link>
        )}
      </ComboboxOptions>
    </Combobox>
  );
};

export default ArtistInput;
