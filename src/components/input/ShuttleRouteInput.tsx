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
  shuttleId: number;
  dailyShuttleId: number;
  value: number | null;
  setValue: (value: number | null) => void;
}

import { ChevronDown } from 'lucide-react';
import { getRoutes } from '@/services/v2/shuttleRoute.services';
import { ShuttleRoutesView } from '@/types/v2/shuttleRoute.type';

const ShuttleRouteInput = ({
  shuttleId,
  dailyShuttleId,
  value,
  setValue,
}: Props) => {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['shuttleRoutes', shuttleId, dailyShuttleId],
    queryFn: async () => await getRoutes(shuttleId, dailyShuttleId),
  });

  const setSelectedRoute: (route: ShuttleRoutesView | null) => void =
    useCallback(
      (route: ShuttleRoutesView | null) => {
        setValue(route?.shuttleRouteId ?? null);
      },
      [setValue],
    );

  const selectedRoute: ShuttleRoutesView | null = useMemo(
    () => data?.find((ds) => ds.shuttleRouteId === value) || null,
    [data, value],
  );

  const filtered: ShuttleRoutesView[] = useMemo(() => {
    return query
      ? filterByFuzzy(data ?? [], query, (p) => p.name)
      : (data ?? []);
  }, [data, query]);

  if (error) return <div>Failed to load artists</div>;

  return (
    <Combobox<ShuttleRoutesView | null>
      immediate
      value={selectedRoute}
      onChange={setSelectedRoute}
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
                ? '노선이 없습니다'
                : '노선 선택'
          }
          defaultValue={null}
          displayValue={(route: null | ShuttleRoutesView) => route?.name ?? ''}
          onChange={(event) => setQuery(event.target.value)}
        />

        <ComboboxOptions
          anchor="bottom"
          className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
        >
          {filtered.map((route) => (
            <ComboboxOption
              key={route.shuttleRouteId}
              value={route}
              className="data-[focus]:bg-blue-100 p-8 flex flex-row"
            >
              <div className="flex flex-col">
                <span>{route.name}</span>
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default ShuttleRouteInput;
