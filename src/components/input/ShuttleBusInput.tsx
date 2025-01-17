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
import { ChevronDown } from 'lucide-react';
import { ShuttleBusesView } from '@/types/v2/shuttleBus.type';
import { getBuses } from '@/services/v2/shuttleBus.services';

interface Props {
  eventId: number;
  dailyEventId: number;
  shuttleRouteId: number;
  value: number | null;
  setValue: (value: number | null) => void;
}

const ShuttleBusInput = ({
  eventId,
  dailyEventId,
  shuttleRouteId,
  value,
  setValue,
}: Props) => {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['shuttleBus', eventId, dailyEventId, shuttleRouteId],
    queryFn: async () => await getBuses(eventId, dailyEventId, shuttleRouteId),
  });

  const setSelectedRoute: (route: ShuttleBusesView | null) => void =
    useCallback(
      (route: ShuttleBusesView | null) => {
        setValue(route?.shuttleBusId ?? null);
      },
      [setValue],
    );

  const setSelectedBus: ShuttleBusesView | null = useMemo(
    () => data?.find((ds) => ds.shuttleBusId === value) || null,
    [data, value],
  );

  const filtered: ShuttleBusesView[] = useMemo(() => {
    return query
      ? filterByFuzzy(data ?? [], query, (p) => p.busName)
      : (data ?? []);
  }, [data, query]);

  if (error) return <div>Failed to load artists</div>;

  return (
    <Combobox<ShuttleBusesView | null>
      immediate
      value={setSelectedBus}
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
                ? '버스가 없습니다'
                : '버스 선택'
          }
          defaultValue={null}
          displayValue={(bus: null | ShuttleBusesView) => bus?.busName ?? ''}
          onChange={(event) => setQuery(event.target.value)}
        />

        <ComboboxOptions
          anchor="bottom"
          className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
        >
          {filtered.map((bus) => (
            <ComboboxOption
              key={bus.shuttleBusId}
              value={bus}
              className="data-[focus]:bg-blue-100 p-8 flex flex-row"
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
