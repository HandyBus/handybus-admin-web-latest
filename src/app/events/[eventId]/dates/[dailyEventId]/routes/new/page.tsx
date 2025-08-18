'use client';

import { useGetEvent } from '@/services/event.service';
import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import Stringifier from '@/utils/stringifier.util';
import List from '@/components/text/List';
import BlueLink from '@/components/link/BlueLink';
import { formatDateString } from '@/utils/date.util';
import MultiRouteForm from './components/MultiRouteForm';
import { FormProvider, useForm } from 'react-hook-form';
import { MultiRouteFormValues } from './form.type';
import { EventDailyShuttlesInEventsViewEntity } from '@/types/event.type';
import dayjs from 'dayjs';

interface Props {
  params: { eventId: string; dailyEventId: string };
}

const Page = ({ params }: Props) => {
  const { eventId, dailyEventId } = params;
  const { data: event } = useGetEvent(eventId);
  const dailyEvent = event
    ? event.dailyEvents.find((d) => d.dailyEventId === dailyEventId)
    : null;

  if (!event || !dailyEvent) {
    return null;
  }

  return (
    <main>
      <Heading>
        노선 추가하기{' '}
        <BlueLink
          href={`/events/${eventId}/dates/${dailyEventId}/routes/new/handy-party`}
          className="ml-8 text-14"
        >
          핸디팟 노선 생성하기
        </BlueLink>
      </Heading>
      <Callout className="mb-20">
        <List>
          <List.item title="행사명">
            <BlueLink href={`/events/${eventId}`}>{event.eventName}</BlueLink>
          </List.item>
          <List.item title="장소">{event.eventLocationName}</List.item>
          <List.item title="날짜">
            {formatDateString(dailyEvent.date)}
          </List.item>
          <List.item title="상태">
            {Stringifier.dailyEventStatus(dailyEvent.status)}
          </List.item>
        </List>
      </Callout>
      <Content
        dailyEvent={dailyEvent}
        eventId={eventId}
        dailyEventId={dailyEventId}
      />
    </main>
  );
};

export default Page;

interface ContentProps {
  dailyEvent: EventDailyShuttlesInEventsViewEntity;
  eventId: string;
  dailyEventId: string;
}

const Content = ({ dailyEvent, eventId, dailyEventId }: ContentProps) => {
  const dailyEventDate = dailyEvent.date;
  const reservationDeadline = dayjs(dailyEventDate)
    .subtract(4, 'day')
    .toISOString();

  const methods = useForm<MultiRouteFormValues>({
    defaultValues: {
      destinationHub: undefined,
      shuttleRoutes: [
        {
          name: '',
          reservationDeadline,
          hasEarlybird: false,
          earlybirdDeadline: reservationDeadline,
          earlybirdPrice: {
            toDestination: 1000000,
            fromDestination: 1000000,
            roundTrip: 1000000,
          },
          regularPrice: {
            toDestination: 1000000,
            fromDestination: 1000000,
            roundTrip: 1000000,
          },
          maxPassengerCount: 0,
          toDestinationHubs: [
            {
              regionId: null,
              regionHubId: null,
              latitude: null,
              longitude: null,
            },
            {
              regionId: null,
              regionHubId: null,
              latitude: null,
              longitude: null,
            },
          ],
          toDestinationArrivalTimes: [
            { time: dailyEventDate },
            { time: dailyEventDate },
          ],
          fromDestinationArrivalTimes: [
            { time: dailyEventDate },
            { time: dailyEventDate },
          ],
        },
      ],
    },
  });

  return (
    <FormProvider {...methods}>
      <MultiRouteForm
        dailyEventDate={dailyEventDate}
        reservationDeadline={reservationDeadline}
        eventId={eventId}
        dailyEventId={dailyEventId}
      />
    </FormProvider>
  );
};
