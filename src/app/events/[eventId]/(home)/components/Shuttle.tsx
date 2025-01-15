import type { EventsView } from '@/types/v2/event.type';
import Image from 'next/image';
import Guide from '@/components/guide/Guide';
import Stringifier from '@/utils/stringifier.util';

interface Props {
  event: EventsView;
}

const EventViewer = ({ event }: Props) => {
  return (
    <>
      <div className="rounded-lg bg-grey-50 p-8">
        <div className="flex flex-row gap-8 p-8">
          <Image
            src={event.eventImageUrl}
            alt={event.eventName}
            width={80}
            height={110}
          />
          <div className="flex flex-col">
            <h1>제목: {event.eventName}</h1>
            {/* TODO use rich viewer */}
            <p>장소: {event.eventLocationName}</p>
            <p>
              출연:{' '}
              {event.eventArtists?.map((p) => p.artistName).join(', ') ?? '-'}
            </p>
            <p>날짜: {event.dailyEvents.map((ds) => ds.date).join(', ')}</p>
            <p>상태: {Stringifier.eventStatus(event.eventStatus)}</p>
          </div>
        </div>
      </div>
      <Guide>
        셔틀 상태의 의미는 다음과 같습니다: OPEN - , ENDED - , INACTIVE -
        비활성화됨
      </Guide>
    </>
  );
};

export default EventViewer;
