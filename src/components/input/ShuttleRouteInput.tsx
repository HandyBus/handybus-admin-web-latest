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
import { ChevronDown } from 'lucide-react';
import { useGetShuttleRoutesOfDailyEvent } from '@/services/shuttleRoute.service';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';

interface Props {
  eventId: string;
  dailyEventId: string;
  value: string | null;
  setValue: (value: string | null) => void;
}

const ShuttleRouteInput = ({
  eventId,
  dailyEventId,
  value,
  setValue,
}: Props) => {
  const [query, setQuery] = useState('');

  const { data, isLoading, error } = useGetShuttleRoutesOfDailyEvent(
    eventId,
    dailyEventId,
  );

  const setSelectedRoute: (route: AdminShuttleRoutesViewEntity | null) => void =
    useCallback(
      (route: AdminShuttleRoutesViewEntity | null) => {
        setValue(route?.shuttleRouteId ?? null);
      },
      [setValue],
    );

  const selectedRoute: AdminShuttleRoutesViewEntity | null = useMemo(
    () => data?.find((ds) => ds.shuttleRouteId === value) || null,
    [data, value],
  );

  const filtered: AdminShuttleRoutesViewEntity[] = useMemo(() => {
    return query
      ? filterByFuzzy(data ?? [], query, (p) => p.name)
      : (data ?? []);
  }, [data, query]);

  if (error) return <div>Failed to load artists</div>;

  return (
    <Combobox<AdminShuttleRoutesViewEntity | null>
      immediate
      value={selectedRoute}
      onChange={setSelectedRoute}
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
                ? '노선이 없습니다'
                : '노선 선택'
          }
          defaultValue={null}
          displayValue={(route: null | AdminShuttleRoutesViewEntity) =>
            route?.name ?? ''
          }
          onChange={(event) => setQuery(event.target.value)}
        />

        <ComboboxOptions
          anchor="bottom"
          className="mt-4 w-[var(--input-width)] rounded-lg bg-white shadow-md empty:invisible"
        >
          {filtered.map((route) => (
            <ComboboxOption
              key={route.shuttleRouteId}
              value={route}
              className="flex flex-row p-8 data-[focus]:bg-blue-100"
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
