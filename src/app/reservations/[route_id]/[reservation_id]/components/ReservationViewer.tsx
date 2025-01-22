import dayjs from 'dayjs';
import { ReservationViewEntity } from '@/types/reservation.type';

interface Props {
  reservation: ReservationViewEntity;
}

const ReservationViewer = ({ reservation }: Props) => {
  return (
    <div>
      <h2>createdAt</h2>
      <div>{dayjs(reservation.createdAt).format('YYYY-MM-DD')}</div>
      <h2>updatedAt</h2>
      <div>{dayjs(reservation.updatedAt).format('YYYY-MM-DD')}</div>
      <p>예약 ID: {reservation.reservationId}</p>
      <h2>유형</h2>
      <div>{reservation.type}</div>
      <h2>취소 상태</h2>
      <div>{reservation.cancelStatus}</div>
      <h2>handyStatus</h2>
      <div>{reservation.handyStatus}</div>
      <h2>reservationStatus</h2>
      <div>{reservation.reservationStatus}</div>
      <h2>hubId</h2>
      {/* {json(reservation)} */}
      {/* to: {json(reservation.toDestinationShuttleRouteHubId)} */}
      {/* from: {json(reservation.fromDestinationShuttleRouteHubId)} */}
      <h2>이 예약의 셔틀 노선</h2>
      {/* {json(reservation.shuttleRoute)} */}
      <h2>결제 정보</h2>
      {/* {json(reservation.payment)} */}
      <h2>승객 정보</h2>
      {/* <DataTable data={reservation.passengers} columns={passengerColumns} /> */}
    </div>
  );
};

export default ReservationViewer;
