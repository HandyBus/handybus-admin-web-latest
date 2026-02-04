'use client';

import BlueLink from '@/components/link/BlueLink';
import Callout from '@/components/text/Callout';
import Heading from '@/components/text/Heading';
import List from '@/components/text/List';
import { useGetEvent } from '@/services/event.service';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';
import Content from './components/Content';

interface Props {
  params: { eventId: string; dailyEventId: string };
}

const Page = ({ params }: Props) => {
  const { eventId, dailyEventId } = params;

  const { data: event, isPending, isError, error } = useGetEvent(eventId);
  const dailyEvent = event
    ? event.dailyEvents.find((el) => el.dailyEventId === dailyEventId)
    : null;

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error! {error?.message}</div>;

  return (
    <main>
      <Heading>핸디팟 노선 생성하기</Heading>
      {dailyEvent && (
        <Callout className="mb-20">
          <List>
            <List.item title="행사명">
              <BlueLink href={`/events/${eventId}`}>{event.eventName}</BlueLink>
            </List.item>
            <List.item title="장소">{event.eventLocationName}</List.item>
            <List.item title="날짜">
              {formatDateString(dailyEvent.dailyEventDate)}
            </List.item>
            <List.item title="상태">
              {Stringifier.dailyEventStatus(dailyEvent.dailyEventStatus)}
            </List.item>
          </List>
        </Callout>
      )}
      <Content eventId={eventId} dailyEventId={dailyEventId} event={event} />
    </main>
  );
};

export default Page;
