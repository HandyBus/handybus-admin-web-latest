'use client';

import {
  postAdminRequestRefund,
  postCompleteRefundRequest,
} from '@/services/payment.service';
import {
  sendHandyPartyCancelled,
  sendShuttleBusCancelled,
} from '@/services/solapi.service';
import { ReservationViewEntity } from '@/types/reservation.type';

// 한번에 처리 가능한 예약 취소 수 (백엔드 요청 제한으로 인하여)
const MAX_BATCH_SIZE = 100;

const DELAY_TIME_BETWEEN_REQUESTS = 300;
const DELAY_TIME_BETWEEN_BATCHES = 30000;

// 다중 예약 무산 처리 (동일 노선에 속해야함)
const useCancelMultipleReservations = () => {
  // 단일 예약 취소 및 환불 처리
  const cancelReservation = async (reservation: ReservationViewEntity) => {
    if (!reservation.paymentId || !reservation.paymentAmount) {
      alert('결제 정보가 없습니다.');
      return;
    }
    const isHandyParty = reservation.shuttleRoute.isHandyParty;
    try {
      const refundReason = isHandyParty ? '핸디팟 무산' : '셔틀버스 무산';
      const refundRequest = await postAdminRequestRefund(
        reservation.paymentId,
        {
          refundAmount: reservation.paymentAmount,
          refundReason,
          type: 'ADMIN_RETRIEVAL',
        },
      );
      await postCompleteRefundRequest(
        reservation.paymentId,
        refundRequest.refundRequestId,
        {
          refundAmount: reservation.paymentAmount,
        },
      );
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n' + error);
    }
  };

  const sendReservationCancelled = async (
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
      ? sendHandyPartyCancelled
      : sendShuttleBusCancelled;
    try {
      await method({ reservationIds, shuttleRouteId });
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n' + error);
    }
  };

  const delay = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const cancelMultipleReservations = async (
    reservations: ReservationViewEntity[],
  ) => {
    const confirmed = confirm(
      '선택한 예약들을 무산 처리 및 안내하시겠습니까?\n최대 5분이 소요됩니다.\n완료 알림이 뜰 때까지 절대 사이트를 끄지 말아주세요.',
    );
    if (!confirmed) {
      return;
    }

    const batches: ReservationViewEntity[][] = Array.from(
      { length: Math.ceil(reservations.length / MAX_BATCH_SIZE) },
      (_, index) => {
        return reservations.slice(
          index * MAX_BATCH_SIZE,
          (index + 1) * MAX_BATCH_SIZE,
        );
      },
    );

    for (const batch of batches) {
      for (const reservation of batch) {
        await cancelReservation(reservation);
        await delay(DELAY_TIME_BETWEEN_REQUESTS);
      }
      if (batch !== batches[batches.length - 1]) {
        await delay(DELAY_TIME_BETWEEN_BATCHES);
      }
    }

    await sendReservationCancelled(reservations);

    alert('예약들이 무산 처리 및 안내되었습니다.');
  };

  return cancelMultipleReservations;
};

export default useCancelMultipleReservations;
