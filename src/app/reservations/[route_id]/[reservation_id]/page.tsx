'use client';

import EditHandyStatusDialog from './components/EditHandyStatusDialog';
import JSONViewer from '@/components/json/JSONViewer';
import AccountInfo from './components/AccountInfo';
import PassengersInfo from './components/PassengersInfo';
import ReservationMetaInfo from './components/\bReservationMetaInfo';
import EventInfo from './components/EventInfo';
import PaymentInfo from './components/PaymentInfo';
import RouteInfo from './components/RouteInfo';
import RouteHubInfo from './components/RouteHubInfo';
import { useGetReservation } from '@/services/shuttleOperation.service';

interface Props {
  params: {
    reservation_id: string;
  };
}

const Page = ({ params: { reservation_id } }: Props) => {
  const { data, isPending, isError, error } = useGetReservation(
    Number(reservation_id),
  );

  if (isPending) return <p>로딩중...</p>;
  if (isError) return <p>에러 : {error.message}</p>;

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">예약 상세보기</h1>
      </header>
      <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
        <JSONViewer value={data} />
        <EditHandyStatusDialog response={data.reservation} />
      </div>
      <ReservationMetaInfo response={data.reservation} />
      <AccountInfo response={data.reservation} />
      <PassengersInfo response={data.reservation} />
      <EventInfo response={data.reservation} />
      <RouteInfo response={data.reservation} />
      <RouteHubInfo response={data.reservation} />
      <PaymentInfo
        response={{
          reservation: data.reservation,
          payment: data.payment,
          tossPayments: data.tossPayments,
        }}
      />
    </main>
  );
};

export default Page;
