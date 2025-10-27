'use client';

import {
  sendHandyPartyConfirmed,
  sendShuttleBusConfirmed,
} from '@/services/solapi.service';
import { ReservationViewEntity } from '@/types/reservation.type';

interface Props {
  onSuccess?: () => void;
}

// 다중 예약 확정 처리
const useConfirmMultipleReservations = ({ onSuccess }: Props) => {
  const sendReservationConfirmed = async (
    reservations: ReservationViewEntity[],
  ) => {
    const isFromSameShuttleRoute = reservations.every(
      (reservation) =>
        reservation.shuttleRoute.shuttleRouteId ===
        reservations[0].shuttleRoute.shuttleRouteId,
    );
    if (!isFromSameShuttleRoute) {
      alert('모든 예약이 동일한 노선에 속하지 않습니다.');
      return;
    }

    const isHandyParty = reservations.some(
      (reservation) => reservation.shuttleRoute.isHandyParty,
    );
    const shuttleRouteId = reservations[0].shuttleRoute.shuttleRouteId;
    const reservationIds = reservations.map(
      (reservation) => reservation.reservationId,
    );

    const method = isHandyParty
      ? sendHandyPartyConfirmed
      : sendShuttleBusConfirmed;
    try {
      await method({ reservationIds, shuttleRouteId });
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n' + error);
    }
  };

  const confirmMultipleReservations = async (
    reservations: ReservationViewEntity[],
  ) => {
    const confirmed = confirm(
      '선택한 예약들을 확정 안내 발송하시겠습니까?\n최대 5분이 소요됩니다.\n완료 알림이 뜰 때까지 절대 사이트를 끄지 말아주세요.',
    );
    if (!confirmed) {
      return;
    }

    await sendReservationConfirmed(reservations);

    onSuccess?.();

    alert('예약들이 확정 안내 발송되었습니다.');
  };

  return confirmMultipleReservations;
};

export default useConfirmMultipleReservations;
