import type { ShuttleType } from '@/types/shuttle.type';
import Image from 'next/image';
import Guide from '@/components/guide/Guide';

interface Props {
  shuttle: ShuttleType;
}

const Shuttle = ({ shuttle }: Props) => {
  return (
    <>
      <div className="rounded-lg bg-grey-50 p-8">
        <div className="flex flex-row gap-8 p-8">
          <Image
            src={shuttle.image}
            alt={shuttle.name}
            width={80}
            height={110}
          />
          <div className="flex flex-col">
            <h1>제목: {shuttle.name}</h1>
            <p>장소: {shuttle.destination.name}</p>
            <p>출연: {shuttle.participants.map((p) => p.name).join(', ')}</p>
            <p>
              날짜:{' '}
              {shuttle.dailyShuttles
                .map((ds) => ds.date.toLocaleDateString())
                .join(', ')}
            </p>
            <p>상태: {shuttle.status}</p>
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

export default Shuttle;
