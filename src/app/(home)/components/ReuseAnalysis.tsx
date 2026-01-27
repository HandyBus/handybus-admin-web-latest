'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { useGetEvents } from '@/services/event.service';
import { EventsViewEntity } from '@/types/event.type';
import { filterByFuzzy } from '@/utils/fuzzy.util';
import Heading from '@/components/text/Heading';
import dayjs from 'dayjs';
import ReuseContent from './ReuseContent';
import { useReuseStatistics } from '../hooks/useReuseStatistics';

const ReuseAnalysis = () => {
  const [query, setQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventsViewEntity | null>(
    null,
  );

  const { data: events, isLoading: isLoadingEvents } = useGetEvents({
    status: 'ENDED',
  });

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    // 기본 선택은 별도 로직으로 처리하므로 여기서는 검색 필터링만 수행
    return query
      ? filterByFuzzy(
          events,
          query,
          (event) =>
            `${event.eventName} ${event.eventLocationName} ${
              event.eventArtists?.join(' ') ?? ''
            }`,
        )
      : events;
  }, [events, query]);

  // 2. 기본 선택 행사 설정 (가장 최근 종료된 행사)
  useEffect(() => {
    if (events && events.length > 0) {
      const sortedEvents = [...events].sort((a, b) => {
        const getLastDate = (e: EventsViewEntity) => {
          if (!e.dailyEvents || e.dailyEvents.length === 0) return '';
          const dates = e.dailyEvents
            .map((de) => de.date)
            .sort((d1, d2) => dayjs(d2).diff(dayjs(d1)));
          return dates[0];
        };
        const dateA = getLastDate(a);
        const dateB = getLastDate(b);
        return dayjs(dateB).diff(dayjs(dateA));
      });

      if (sortedEvents.length > 0) {
        setSelectedEvent(sortedEvents[0]);
      }
    }
  }, [events]);

  const handleEventChange = useCallback((event: EventsViewEntity | null) => {
    setSelectedEvent(event);
    setQuery('');
  }, []);

  // 3 ~ 5. 통계 데이터 조회 및 가공 (Hook 사용)
  const { isLoadingStats, chartData, cardStats } =
    useReuseStatistics(selectedEvent);

  return (
    <div className="flex w-full flex-col gap-32">
      <Heading.h4>핸디버스 첫 이용 유저 현황</Heading.h4>

      <div className="flex min-h-[420px] w-full flex-col rounded-16 bg-basic-white p-24 shadow-md md:p-32">
        {/* 헤더 영역 */}
        <div className="mb-24 flex flex-col justify-end gap-16 md:flex-row md:items-center">
          <Combobox
            immediate
            value={selectedEvent}
            onChange={handleEventChange}
            onClose={() => setQuery('')}
          >
            <div className="relative w-full md:w-272">
              <ComboboxButton className="absolute right-12 top-1/2 -translate-y-1/2 text-basic-black">
                <ChevronDown className="h-20 w-20" />
              </ComboboxButton>
              <ComboboxInput
                className="w-full rounded-8 border border-basic-black py-8 pl-12 pr-40 text-16 font-500 text-basic-black focus:outline-none"
                placeholder="행사를 선택하세요"
                displayValue={(event: EventsViewEntity | null) =>
                  event?.eventName ?? ''
                }
                onChange={(e) => setQuery(e.target.value)}
              />
              <ComboboxOptions
                anchor="bottom"
                className="ring-black/5 z-50 mt-4 max-h-240 w-[var(--input-width)] overflow-auto rounded-8 bg-basic-white p-4 shadow-lg ring-1 focus:outline-none"
              >
                {isLoadingEvents ? (
                  <div className="p-8 text-center text-basic-grey-400">
                    로딩 중...
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="p-8 text-center text-basic-grey-400">
                    검색 결과가 없습니다
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <ComboboxOption
                      key={event.eventId}
                      value={event}
                      className="hover:bg-indigo-50 data-[focus]:bg-indigo-50 cursor-pointer select-none rounded-4 px-12 py-8 text-14 text-basic-black"
                    >
                      {event.eventName}
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </div>
          </Combobox>
        </div>

        {/* 컨텐츠 영역 */}
        <ReuseContent
          selectedEvent={selectedEvent}
          isLoadingEvents={isLoadingEvents}
          isLoadingStats={isLoadingStats}
          chartData={chartData}
          cardStats={cardStats}
        />
      </div>
    </div>
  );
};

export default ReuseAnalysis;
