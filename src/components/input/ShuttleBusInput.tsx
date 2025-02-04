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
import { useGetShuttleBuses } from '@/services/shuttleOperation.service';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';

interface Props {
  eventId: string;
  dailyEventId: string;
  shuttleRouteId: string;
  value: string | null;
  setValue: (value: string | null) => void;
}

const ShuttleBusInput = ({
  eventId,
  dailyEventId,
  shuttleRouteId,
  value,
  setValue,
}: Props) => {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useGetShuttleBuses(
    eventId,
    dailyEventId,
    shuttleRouteId,
  );

  const setSelectedRoute: (route: ShuttleBusesViewEntity | null) => void =
    useCallback(
      (route: ShuttleBusesViewEntity | null) => {
        setValue(route?.shuttleBusId ?? null);
      },
      [setValue],
    );

  const setSelectedBus: ShuttleBusesViewEntity | null = useMemo(
    () => data?.find((ds) => ds.shuttleBusId === value) || null,
    [data, value],
  );

  const filtered: ShuttleBusesViewEntity[] = useMemo(() => {
    return query
      ? filterByFuzzy(data ?? [], query, (p) => p.busName)
      : (data ?? []);
  }, [data, query]);

  if (error) return <div>Failed to load artists</div>;

  return (
    <Combobox<ShuttleBusesViewEntity | null>
      immediate
      value={setSelectedBus}
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
                ? '버스가 없습니다'
                : '버스 선택'
          }
          defaultValue={null}
          displayValue={(bus: null | ShuttleBusesViewEntity) =>
            bus?.busName ?? ''
          }
          onChange={(event) => setQuery(event.target.value)}
        />

        <ComboboxOptions
          anchor="bottom"
          className="mt-4 w-[var(--input-width)] rounded-lg bg-white shadow-md empty:invisible"
        >
          {filtered.map((bus) => (
            <ComboboxOption
              key={bus.shuttleBusId}
              value={bus}
              className="flex flex-row p-8 data-[focus]:bg-blue-100"
            >
              <div className="flex flex-col">
                <span>{bus.busName}</span>
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default ShuttleBusInput;
