'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from '@headlessui/react';
import { filterByFuzzy } from '@/utils/fuzzy.util';

interface Props {
  value: string | null;
  setValue: (value: string | null) => void;
}

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useGetEvents } from '@/services/shuttleOperation.service';
import { EventsViewEntity } from '@/types/event.type';

const EventInput = ({ value, setValue }: Props) => {
  const [query, setQuery] = useState('');

  const { data, isLoading, error } = useGetEvents();

  const setSelectedShuttle = useCallback(
    (shuttle: EventsViewEntity | null) => {
      setValue(shuttle?.eventId ?? null);
    },
    [setValue],
  );

  const selectedShuttle: EventsViewEntity | null = useMemo(
    () => data?.find((event) => event.eventId === value) || null,
    [data, value],
  );

  const filtered: EventsViewEntity[] = useMemo(() => {
    return query
      ? filterByFuzzy(
          data ?? [],
          query,
          (p) =>
            `${p.eventName} ${p.eventName} ${p.eventLocationName} ${p.eventArtists?.join(' ') ?? ''}`,
        )
      : (data ?? []);
  }, [data, query]);

  if (error) return <div>Failed to load artists</div>;

  return (
    <Combobox
      immediate
      value={selectedShuttle}
      onChange={setSelectedShuttle}
      onClose={() => setQuery('')}
    >
      <div className="group relative">
        <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
          <ChevronDown />
        </ComboboxButton>
        <ComboboxInput
          className="size-full rounded-lg border border-grey-200 p-8 focus:outline-blue-400"
          aria-label="Assignee"
          placeholder={
            isLoading
              ? '로딩 중…'
              : data?.length === 0
                ? '셔틀이 없습니다'
                : '셔틀 선택'
          }
          defaultValue={null}
          displayValue={(shuttle: null | EventsViewEntity) =>
            shuttle?.eventName ?? ''
          }
          onChange={(event) => setQuery(event.target.value)}
        />

        <ComboboxOptions
          anchor="bottom"
          className="mt-4 w-[var(--input-width)] rounded-lg bg-white shadow-md empty:invisible"
        >
          {filtered.map((event) => (
            <ComboboxOption
              key={event.eventId}
              value={event}
              className="flex flex-row p-8 data-[focus]:bg-blue-100"
            >
              <Image
                src={event.eventImageUrl}
                alt={event.eventName}
                width={100}
                height={100}
              />
              <div className="flex flex-col">
                <span>{event.eventName}</span>
                <span>
                  {event.eventArtists?.map((p) => p.artistName).join(', ')}
                </span>
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default EventInput;
