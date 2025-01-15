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
  value: number | null;
  setValue: (value: number | null) => void;
}

import { ChevronDown } from 'lucide-react';
import { getEvent } from '@/services/v2/shuttleEvent.services';
import { EventsView } from '@/types/v2/event.type';
import dayjs from 'dayjs';

type DailyEvent = ArrayElement<EventsView['dailyEvents']>;

const DailyShuttleInput = ({ shuttleId, value, setValue }: Props) => {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['shuttle', shuttleId],
    queryFn: async () => await getEvent(shuttleId),
  });

  const setSelectedDailyShuttle = useCallback(
    (dailyEvent: DailyEvent | null) => {
      setValue(dailyEvent?.dailyEventId ?? null);
    },
    [setValue],
  );

  const selectedDailyShuttle = useMemo(
    () => data?.dailyEvents.find((ds) => ds.dailyEventId === value) || null,
    [data, value],
  );

  const filtered: DailyEvent[] = useMemo(() => {
    return query
      ? filterByFuzzy(data?.dailyEvents ?? [], query, (p) =>
          dayjs(p.date).format('YYYY-MM-DD'),
        )
      : (data?.dailyEvents ?? []);
  }, [data, query]);

  if (error) return <div>Failed to load artists</div>;

  return (
    <Combobox<DailyEvent | null>
      immediate
      value={selectedDailyShuttle}
      onChange={setSelectedDailyShuttle}
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
              : !data || data.dailyEvents.length === 0
                ? '등록된 날짜가 없습니다'
                : '날짜 선택'
          }
          defaultValue={null}
          displayValue={(dailyEvent: DailyEvent | null) =>
            dailyEvent?.date.toLocaleDateString() ?? ''
          }
          onChange={(event) => setQuery(event.target.value)}
        />

        <ComboboxOptions
          anchor="bottom"
          className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
        >
          {filtered.map((dailyEvent) => (
            <ComboboxOption
              key={dailyEvent.dailyEventId}
              value={dailyEvent}
              className="data-[focus]:bg-blue-100 p-8 flex flex-row"
            >
              <div className="flex flex-col">
                <span>{dayjs(dailyEvent.date).format('YYYY-MM-DD')}</span>
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default DailyShuttleInput;
