'use client';

import BlueLink from '@/components/link/BlueLink';
import { useGetEventsStatsWithPagination } from '@/services/event.service';
import Heading from '@/components/text/Heading';
import { useMemo } from 'react';
import EventFilter from './components/EventFilter';
import useEventFilter from './hooks/useEventFilter';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import dayjs from 'dayjs';
import Image from 'next/image';
import Button from '@/components/button/Button';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { DEFAULT_EVENT_IMAGE } from '@/constants/common';
import { useRouter } from 'next/navigation';

const EVENT_PAGINATION_LIMIT = 7;

const Page = () => {
  const [option, dispatch] = useEventFilter();
  const {
    data: eventsStats,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useGetEventsStatsWithPagination({
    ...option,
    orderBy: 'startDate',
    additionalOrderOptions: 'ASC',
    limit: EVENT_PAGINATION_LIMIT,
  });

  const flattenedEventsStats = useMemo(
    () =>
      eventsStats?.pages
        .flatMap((page) => page.events)
        .map((event) => ({
          ...event,
          dailyEvents: event.dailyEvents
            ? [...event.dailyEvents].sort((a, b) =>
                dayjs(a.date).diff(dayjs(b.date)),
              )
            : [],
        })),
    [eventsStats],
  );

  const { InfiniteScrollTrigger } = useInfiniteScroll({
    fetchNextPage,
    isLoading: isFetching,
    hasNextPage,
  });

  const router = useRouter();

  return (
    <main>
      <Heading className="flex items-baseline gap-20">
        행사 대시보드
        <BlueLink href="/events/new" className="text-14">
          추가하기
        </BlueLink>
        <BlueLink href="/events/pin" className="text-14">
          이달의 추천 행사 관리
        </BlueLink>
      </Heading>
      <EventFilter option={option} dispatch={dispatch} />
      <section className="flex flex-col gap-32">
        {flattenedEventsStats?.map((event) => {
          return (
            <div
              key={event.eventId}
              className="rounded-16 bg-basic-white shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]"
            >
              <div className="grid grid-cols-[60px_2fr_1fr_1fr_1fr] items-center px-28 py-20">
                <div className="relative h-88 w-60 overflow-hidden rounded-8 bg-basic-grey-700">
                  <Image
                    src={event.eventImageUrl || DEFAULT_EVENT_IMAGE}
                    alt="event-image"
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="ml-16 text-left text-20 font-700">
                  {event.eventName}
                </h2>
                <p className="text-16 font-500">{event.eventLocationName}</p>
                <p className="text-16 font-500">
                  {Stringifier.eventType(event.eventType)}
                </p>
                <div className="flex items-center justify-end gap-8">
                  <Button
                    size="small"
                    variant="tertiary"
                    onClick={() =>
                      router.push(`/events/${event.eventId}/default-routes`)
                    }
                    className="w-116"
                  >
                    기본 노선 생성하기
                  </Button>
                  <Button
                    size="small"
                    variant="tertiary"
                    onClick={() =>
                      router.push(`/events/${event.eventId}/sales`)
                    }
                  >
                    매출 확인
                  </Button>
                  <Button
                    size="small"
                    variant="tertiary"
                    onClick={() => router.push(`/events/${event.eventId}`)}
                  >
                    상세
                  </Button>
                  <Button
                    size="small"
                    variant="tertiary"
                    onClick={() => router.push(`/events/${event.eventId}/edit`)}
                  >
                    수정
                  </Button>
                </div>
              </div>
              <div className="grid h-[32px] grid-cols-7 items-center bg-basic-grey-100">
                <h4 className="whitespace-nowrap break-keep text-center text-16 font-500 text-basic-grey-600">
                  날짜
                </h4>
                <h4 className="whitespace-nowrap break-keep text-center text-16 font-500 text-basic-grey-600">
                  상태
                </h4>
                <h4 className="whitespace-nowrap break-keep text-center text-16 font-500 text-basic-grey-600">
                  노선 확정 상태
                </h4>
                <h4 className="whitespace-nowrap break-keep text-center text-16 font-500 text-basic-grey-600">
                  개설된 노선
                </h4>
                <h4 className="whitespace-nowrap break-keep text-center text-16 font-500 text-basic-grey-600">
                  총 수요조사
                </h4>
                <h4 className="whitespace-nowrap break-keep text-center text-16 font-500 text-basic-grey-600">
                  총 예약
                </h4>
                <h4 className="whitespace-nowrap break-keep text-center text-16 font-500 text-basic-grey-600">
                  액션
                </h4>
              </div>
              <div className="flex w-full flex-col">
                {event.dailyEvents.map((dailyEvent) => {
                  const shuttleRouteConfirmDate = dayjs(dailyEvent.date)
                    .tz('Asia/Seoul')
                    .subtract(11, 'day')
                    .startOf('day');
                  const today = dayjs().tz('Asia/Seoul').startOf('day');
                  const isShuttleRouteConfirmDate = today.isSame(
                    shuttleRouteConfirmDate,
                    'day',
                  );
                  const isBeforeShuttleRouteConfirmDate = today.isBefore(
                    shuttleRouteConfirmDate,
                    'day',
                  );
                  const isAfterShuttleRouteConfirmDate = today.isAfter(
                    shuttleRouteConfirmDate,
                    'day',
                  );
                  const ddayBeforeShuttleRouteConfirmDate = Math.abs(
                    today.diff(shuttleRouteConfirmDate, 'days'),
                  );

                  return (
                    <div
                      key={dailyEvent.dailyEventId}
                      className="grid w-full grid-cols-7 items-center border-b border-basic-grey-100 py-16"
                    >
                      <div className="whitespace-nowrap break-keep text-center text-18 font-500">
                        {formatDateString(dailyEvent.date, 'date')}
                      </div>
                      <div className="flex flex-col items-center gap-[6px]">
                        <div
                          className={`flex h-[30px] items-center justify-center whitespace-nowrap break-keep rounded-full px-8 text-center text-14 font-500 ${
                            dailyEvent.status === 'OPEN'
                              ? 'bg-[#E8FFE6] text-[#00C83F]'
                              : dailyEvent.status === 'CLOSED'
                                ? 'bg-basic-grey-100 text-basic-grey-700'
                                : 'bg-basic-grey-700 text-basic-white'
                          }`}
                        >
                          {Stringifier.eventStatus(dailyEvent.status)}
                        </div>
                        <span className="text-12 font-500 text-basic-grey-500">
                          {dayjs(dailyEvent.closeDeadline)
                            .tz('Asia/Seoul')
                            .format('~ MM.DD')}
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center whitespace-nowrap break-keep text-center text-16 font-500">
                        <div
                          className={`flex h-[30px] items-center justify-center whitespace-nowrap break-keep rounded-full px-8 text-center text-14 font-500 ${
                            isShuttleRouteConfirmDate
                              ? 'bg-basic-red-100 text-basic-red-500'
                              : isAfterShuttleRouteConfirmDate
                                ? 'bg-basic-grey-100 text-basic-grey-700'
                                : 'bg-basic-grey-700 text-basic-white'
                          }`}
                        >
                          {isShuttleRouteConfirmDate
                            ? '확정 당일'
                            : isAfterShuttleRouteConfirmDate
                              ? '확정됨'
                              : isBeforeShuttleRouteConfirmDate
                                ? `D-${ddayBeforeShuttleRouteConfirmDate}`
                                : '오류 발생'}
                        </div>
                        <span className="text-12 font-500 text-basic-grey-500">
                          {shuttleRouteConfirmDate.format('~ MM.DD')}
                        </span>
                      </div>
                      <div className="whitespace-nowrap break-keep text-center text-16 font-500 text-basic-black">
                        {dailyEvent.shuttleRouteCount}
                      </div>
                      <div className="whitespace-nowrap break-keep text-center text-16 font-500">
                        {dailyEvent.totalDemandCount}
                      </div>
                      <div className="whitespace-nowrap break-keep text-center text-16 font-500 text-basic-black">
                        {dailyEvent.totalReservationCount}
                      </div>
                      <div className="flex flex-col items-center justify-center gap-4">
                        <BlueLink
                          href={`/events/${event.eventId}/dates/${dailyEvent.dailyEventId}`}
                        >
                          노선 목록
                        </BlueLink>
                        <BlueLink
                          href={`/events/${event.eventId}/dates/${dailyEvent.dailyEventId}/demands`}
                        >
                          수요조사 내역
                        </BlueLink>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <InfiniteScrollTrigger />
      </section>
    </main>
  );
};

export default Page;
