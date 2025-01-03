'use client';
import { getReservation } from '@/services/api/reservations.services';
import DataTable from '@/components/table/DataTable';
import { columns as passengerColumns } from './types/passenger.table.types';
import dayjs from 'dayjs';
import Guide from '@/components/guide/Guide';
import EditHandyStatusDialog from './components/EditHandyStatusDialog';
import { useQuery } from '@tanstack/react-query';
import JSONViewer from '@/components/json/JSONViewer';

interface Props {
  params: {
    reservation_id: string;
  };
}

const json = (v: unknown) => JSON.stringify(v, null, 2);

const Page = ({ params: { reservation_id } }: Props) => {
  const {
    data: reservation,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['reservations', reservation_id],
    queryFn: () => getReservation(Number(reservation_id)),
  });

  if (isPending) return <p>로딩중...</p>;
  if (isError) return <p>에러 : {error.message}</p>;

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">예약 상세보기</h1>
      </header>
      <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
        <JSONViewer value={reservation} />
        <EditHandyStatusDialog reservation={reservation} />
      </div>
      <h2>createdAt</h2>
      <div>{dayjs(reservation.createdAt).format('YYYY-MM-DD')}</div>
      <h2>updatedAt</h2>
      <div>{dayjs(reservation.updatedAt).format('YYYY-MM-DD')}</div>
      <p>예약 ID: {reservation_id}</p>
      <h2>유형</h2>
      <div>{reservation.type}</div>
      <Guide>
        <p>TO_DESTINATION: 목적지행 편도</p>
        <p>FROM_DESTINATION: 귀가행 편도</p>
        <p>ROUND_TRIP: 왕복</p>
      </Guide>
      <h2>취소 상태</h2>
      <div>{reservation.cancelStatus}</div>
      <Guide>
        <p>취소 상태가 NONE인 경우, 예약 후 취소 요청이 없는 상태입니다.</p>
        <p>취소 상태가 CANCEL_REQUEST인 경우, 취소 요청이 들어온 상태입니다.</p>
        <p>취소 상태가 CANCEL_COMPLETE인 경우, 취소가 완료된 상태입니다.</p>
      </Guide>
      <h2>handyStatus</h2>
      <div>{reservation.handyStatus}</div>
      <Guide>
        <p>NOT_SUPPORTED: 유저가 핸디에 지원하지 않았습니다.</p>
        <p>SUPPORTED: 유저가 핸디에 지원했습니다.</p>
        <p>DECLINED: 핸디 지원이 거절된 상태입니다.</p>
        <p>ACCEPTED: 핸디 지원이 수락된 상태입니다.</p>
      </Guide>
      <h2>reservationStatus</h2>
      <div>{reservation.reservationStatus}</div>
      <Guide>
        <p>NOT_PAYMENT: 결제가 완료되지 않은 상태입니다.</p>
        <p>COMPLETE_PAYMENT: 결제가 완료된 상태입니다.</p>
        <p>RESERVATION_CONFIRMED: 예약이 확정된 상태입니다.</p>
        <p>CANCEL: 취소된 상태입니다.</p>
      </Guide>
      <h2>hubId</h2>
      {json(reservation)}
      to: {json(reservation.toDestinationShuttleRouteHubId)}
      from: {json(reservation.fromDestinationShuttleRouteHubId)}
      <h2>이 예약의 셔틀 노선</h2>
      {json(reservation.shuttleRoute)}
      <h2>결제 정보</h2>
      {json(reservation.payment)}
      <h2>승객 정보</h2>
      <DataTable data={reservation.passengers} columns={passengerColumns} />
    </main>
  );
};

export default Page;
