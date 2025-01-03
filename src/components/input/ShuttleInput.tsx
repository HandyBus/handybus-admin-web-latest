'use client';

import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from '@headlessui/react';
import { filterByFuzzy } from '@/utils/fuzzy.util';

interface Props {
  value: number | null;
  setValue: (value: number | null) => void;
}

import { ChevronDown } from 'lucide-react';
import { getAllShuttles } from '@/services/api/shuttle.services';
import { ShuttleType } from '@/types/shuttle.type';
import Image from 'next/image';

const ShuttleInput = ({ value, setValue }: Props) => {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['shuttles'],
    queryFn: async () => await getAllShuttles(),
  });

  const setSelectedShuttle = useCallback(
    (shuttle: ShuttleType | null) => {
      setValue(shuttle?.shuttleId ?? null);
    },
    [setValue],
  );

  const selectedShuttle = useMemo(
    () => data?.find((shuttle) => shuttle.shuttleId === value) || null,
    [data, value],
  );

  const filtered: ShuttleType[] = useMemo(() => {
    return query
      ? filterByFuzzy(data ?? [], query, (p) => p.name)
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
      <div className="relative group">
        <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
          <ChevronDown />
        </ComboboxButton>
        <ComboboxInput
          className="p-8 size-full border border-grey-200 rounded-lg focus:outline-blue-400"
          aria-label="Assignee"
          placeholder={
            isLoading
              ? '로딩 중…'
              : data?.length === 0
                ? '셔틀이 없습니다'
                : '셔틀 선택'
          }
          defaultValue={null}
          displayValue={(shuttle: null | ShuttleType) => shuttle?.name ?? ''}
          onChange={(event) => setQuery(event.target.value)}
        />

        <ComboboxOptions
          anchor="bottom"
          className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
        >
          {filtered.map((shuttle) => (
            <ComboboxOption
              key={shuttle.shuttleId}
              value={shuttle}
              className="data-[focus]:bg-blue-100 p-8 flex flex-row"
            >
              <Image
                src={shuttle.image}
                alt={shuttle.name}
                width={100}
                height={100}
              />
              <div className="flex flex-col">
                <span>{shuttle.name}</span>
                <span>
                  {shuttle.participants.map((p) => p.name).join(', ')}
                </span>
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default ShuttleInput;
