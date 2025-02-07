import Image from 'next/image';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { EventsViewEntity } from '@/types/event.type';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';
import { DEFAULT_EVENT_IMAGE } from '@/constants/common';

interface Props {
  event: EventsViewEntity;
}

const EventViewer = ({ event }: Props) => {
  return (
    <Callout>
      <div className="flex flex-row gap-8 p-8">
        <Image
          src={event.eventImageUrl || DEFAULT_EVENT_IMAGE}
          alt={event.eventName}
          width={80}
          height={110}
        />
        <List>
          <List.item title="행사명">{event.eventName}</List.item>
          <List.item title="장소">{event.eventLocationName}</List.item>
          <List.item title="아티스트">
            {event.eventArtists?.map((p) => p.artistName).join(', ') ?? '-'}
          </List.item>
          <List.item title="날짜">
            {event.dailyEvents
              .map((ds) => formatDateString(ds.date))
              .join(', ')}
          </List.item>
          <List.item title="상태">
            {Stringifier.eventStatus(event.eventStatus)}
          </List.item>
        </List>
      </div>
    </Callout>
  );
};

export default EventViewer;
