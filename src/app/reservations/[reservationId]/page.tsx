'use client';

import EditHandyStatusDialog from '../../../components/dialog/EditHandyStatusDialog';
import JSONViewer from '@/components/json/JSONViewer';
import AccountInfo from './components/AccountInfo';
import ReservationMetaInfo from './components/\bReservationMetaInfo';
import EventInfo from './components/EventInfo';
import PaymentInfo from './components/PaymentInfo';
import RouteInfo from './components/RouteInfo';
import RouteHubInfo from './components/RouteHubInfo';
import { useGetReservation } from '@/services/reservation.service';
import Heading from '@/components/text/Heading';

interface Props {
  params: {
    reservationId: string;
  };
}

const Page = ({ params: { reservationId } }: Props) => {
  const { data, isPending, isError, error } = useGetReservation(reservationId);

  if (isPending) return <p>로딩중...</p>;
  if (isError) return <p>에러 : {error.message}</p>;

  return (
    <main>
      <Heading>예약 상세 정보</Heading>
      <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
        <JSONViewer value={data} />
        <EditHandyStatusDialog response={data.reservation} />
      </div>
      <section className="flex w-full flex-col gap-16 py-20">
        <ReservationMetaInfo response={data.reservation} />
        <AccountInfo response={data.reservation} />
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
      </section>
    </main>
  );
};

export default Page;
