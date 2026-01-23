'use client';

import { useGetEvent } from '@/services/event.service';
import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';
import BlueLink from '@/components/link/BlueLink';
import { FormProvider, useForm } from 'react-hook-form';
import { BulkRouteFormValues } from './form.type';
import BulkRouteForm from './components/BulkRouteForm';
import dayjs from 'dayjs';
import { EventsViewEntity } from '@/types/event.type';

interface Props {
  params: { eventId: string };
}

const Page = ({ params }: Props) => {
  const { eventId } = params;
  const { data: event } = useGetEvent(eventId);

  if (!event) {
    return null;
  }

  return (
    <main>
      <Heading>
        기본 노선 생성하기{' '}
        <BlueLink href={`/events/${eventId}`} className="ml-8 text-14">
          행사 상세보기
        </BlueLink>
      </Heading>
      <Callout className="mb-20">
        <List>
          <List.item title="행사명">
            <BlueLink href={`/events/${eventId}`}>{event.eventName}</BlueLink>
          </List.item>
          <List.item title="장소">{event.eventLocationName}</List.item>
          <List.item title="기간">
            {dayjs(event.startDate).format('YYYY-MM-DD')} ~{' '}
            {dayjs(event.endDate).format('YYYY-MM-DD')}
          </List.item>
        </List>
      </Callout>
      <Content event={event} />
    </main>
  );
};

export default Page;

interface ContentProps {
  event: EventsViewEntity;
}

const Content = ({ event }: ContentProps) => {
  const defaultSelectedDailyEventIds = event.dailyEvents.map(
    (de) => de.dailyEventId,
  );

  // 현재 날짜를 기준으로 성수기/비수기 자동 설정
  // 비수기: 12-2월, 7-8월
  // 성수기: 3-6월, 9-11월
  const getDefaultSeason = (): '성수기' | '비수기' => {
    const currentMonth = dayjs().tz('Asia/Seoul').month() + 1; // dayjs month는 0부터 시작하므로 +1
    if (
      currentMonth === 12 ||
      currentMonth <= 2 ||
      currentMonth === 7 ||
      currentMonth === 8
    ) {
      return '비수기';
    }
    return '성수기';
  };

  const methods = useForm<BulkRouteFormValues>({
    defaultValues: {
      selectedDailyEventIds: defaultSelectedDailyEventIds,
      destinationHub: undefined,
      reservationDeadlineDays: 5,
      toDestinationArrivalTime: null,
      fromDestinationDepartureTime: null,
      season: getDefaultSeason(),
      routes: [],
    },
  });

  return (
    <FormProvider {...methods}>
      <BulkRouteForm event={event} />
    </FormProvider>
  );
};
