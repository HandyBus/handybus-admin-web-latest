'use client';
import { getReservationAndPayments } from '@/services/v2/reservations.services';
// import EditHandyStatusDialog from './components/EditHandyStatusDialog';
import { useQuery } from '@tanstack/react-query';
import JSONViewer from '@/components/json/JSONViewer';
import ReservationViewer from './components/ReservationViewer';

interface Props {
  params: {
    reservation_id: string;
  };
}

const Page = ({ params: { reservation_id } }: Props) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['reservations', reservation_id],
    queryFn: () => getReservationAndPayments(Number(reservation_id)),
  });

  if (isPending) return <p>로딩중...</p>;
  if (isError) return <p>에러 : {error.message}</p>;

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">예약 상세보기</h1>
      </header>
      <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
        <JSONViewer value={data} />
        {/* <EditHandyStatusDialog reservation={data.reservation} /> */}
      </div>
      <ReservationViewer reservation={data.reservation} />
    </main>
  );
};

export default Page;
