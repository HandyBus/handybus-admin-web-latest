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
import { getShuttle } from '@/app/actions/shuttle.action';
import { DailyShuttleType } from '@/types/dailyShuttle.type';
import dayjs from 'dayjs';

const DailyShuttleInput = ({ shuttleId, value, setValue }: Props) => {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['shuttle', shuttleId],
    queryFn: async () => await getShuttle(shuttleId),
  });

  const setSelectedDailyShuttle = useCallback(
    (dailyShuttle: DailyShuttleType | null) => {
      setValue(dailyShuttle?.dailyShuttleId ?? null);
    },
    [setValue],
  );

  const selectedDailyShuttle = useMemo(
    () => data?.dailyShuttles.find((ds) => ds.dailyShuttleId === value) || null,
    [data, value],
  );

  const filtered: DailyShuttleType[] = useMemo(() => {
    return query
      ? filterByFuzzy(data?.dailyShuttles ?? [], query, (p) =>
          dayjs(p.date).format('YYYY-MM-DD'),
        )
      : (data?.dailyShuttles ?? []);
  }, [data, query]);

  if (error) return <div>Failed to load artists</div>;

  return (
    <Combobox
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
              : data?.dailyShuttles.length === 0
                ? '셔틀이 없습니다'
                : '셔틀 선택'
          }
          defaultValue={null}
          displayValue={(dailyShuttle: null | DailyShuttleType) =>
            dailyShuttle?.date.toLocaleDateString() ?? ''
          }
          onChange={(event) => setQuery(event.target.value)}
        />

        <ComboboxOptions
          anchor="bottom"
          className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
        >
          {filtered.map((dailyShuttle) => (
            <ComboboxOption
              key={dailyShuttle.dailyShuttleId}
              value={dailyShuttle}
              className="data-[focus]:bg-blue-100 p-8 flex flex-row"
            >
              <div className="flex flex-col">
                <span>{dayjs(dailyShuttle.date).format('YYYY-MM-DD')}</span>
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default DailyShuttleInput;
