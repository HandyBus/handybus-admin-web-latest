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
import dayjs from 'dayjs';
import { useGetEvent } from '@/services/event.service';
import { EventDailyShuttlesInEventsViewEntity } from '@/types/event.type';

interface Props {
  eventId: string;
  value: string | null;
  setValue: (value: string | null) => void;
}

const EventDailyShuttlesInEventsViewEntityInput = ({
  eventId,
  value,
  setValue,
}: Props) => {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useGetEvent(eventId);

  const setSelectedDailyShuttle = useCallback(
    (dailyEvent: EventDailyShuttlesInEventsViewEntity | null) => {
      setValue(dailyEvent?.dailyEventId ?? null);
    },
    [setValue],
  );

  const selectedDailyShuttle = useMemo(
    () => data?.dailyEvents.find((ds) => ds.dailyEventId === value) || null,
    [data, value],
  );

  const filtered: EventDailyShuttlesInEventsViewEntity[] = useMemo(() => {
    return query
      ? filterByFuzzy(data?.dailyEvents ?? [], query, (p) =>
          dayjs(p.dailyEventDate).format('YYYY-MM-DD'),
        )
      : (data?.dailyEvents ?? []);
  }, [data, query]);

  if (error) return <div>Failed to load artists</div>;

  return (
    <Combobox<EventDailyShuttlesInEventsViewEntity | null>
      immediate
      value={selectedDailyShuttle}
      onChange={setSelectedDailyShuttle}
      onClose={() => setQuery('')}
    >
      <div className="group relative">
        <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-basic-grey-400 group-focus:text-basic-blue-400">
          <ChevronDown />
        </ComboboxButton>
        <ComboboxInput
          className="size-full rounded-8 border border-basic-grey-200 p-8 focus:outline-basic-blue-400"
          aria-label="Assignee"
          placeholder={
            isLoading
              ? '로딩 중…'
              : !data || data.dailyEvents.length === 0
                ? '등록된 날짜가 없습니다'
                : '날짜 선택'
          }
          defaultValue={null}
          displayValue={(
            dailyEvent: EventDailyShuttlesInEventsViewEntity | null,
          ) => dailyEvent?.dailyEventDate ?? ''}
          onChange={(event) => setQuery(event.target.value)}
        />

        <ComboboxOptions
          anchor="bottom"
          className="mt-4 w-[var(--input-width)] rounded-8 bg-basic-white shadow-md empty:invisible"
        >
          {filtered.map((dailyEvent) => (
            <ComboboxOption
              key={dailyEvent.dailyEventId}
              value={dailyEvent}
              className="flex flex-row p-8 data-[focus]:bg-basic-blue-100"
            >
              <div className="flex flex-col">
                <span>
                  {dayjs(dailyEvent.dailyEventDate).format('YYYY-MM-DD')}
                </span>
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default EventDailyShuttlesInEventsViewEntityInput;
