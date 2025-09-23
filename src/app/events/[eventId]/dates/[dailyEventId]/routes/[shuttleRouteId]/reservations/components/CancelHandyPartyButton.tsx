'use client';

import BlueButton from '@/components/link/BlueButton';
import { HANDY_PARTY_PREFIX } from '@/constants/common';
import {
  postAdminRequestRefund,
  postCompleteRefundRequest,
} from '@/services/payment.service';
import { sendHandyPartyCancelled } from '@/services/solapi.service';
import { ReservationViewEntity } from '@/types/reservation.type';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  reservation: ReservationViewEntity;
}

const CancelHandyPartyButton = ({ reservation }: Props) => {
  const queryClient = useQueryClient();

  const isHandyParty =
    reservation.shuttleRoute.name.includes(HANDY_PARTY_PREFIX) ?? false;

  const handleClick = async () => {
    if (!isHandyParty) {
      alert('핸디팟 노선이 아닙니다.');
      return;
    }
    if (
      !confirm(
        '해당 예약을 무산 처리 및 안내하시겠습니까?\n최대 10초가 소요됩니다.\n절대 사이트를 끄지 말아주세요.',
      )
    ) {
      return;
    }
    await handleRetrieveReservation(reservation);
    await handleSendHandyPartyCancelled(reservation.reservationId);
    alert('핸디팟 무산 처리 및 안내가 완료되었습니다.');
  };

  const handleRetrieveReservation = async (
    reservation: ReservationViewEntity,
  ) => {
    if (!reservation.paymentId || !reservation.paymentAmount) {
      alert('결제 정보가 없습니다.');
      return;
    }
    try {
      const refundRequest = await postAdminRequestRefund(
        reservation.paymentId,
        {
          refundAmount: reservation.paymentAmount,
          refundReason: '핸디팟 무산',
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

      queryClient.invalidateQueries({
        queryKey: ['reservation'],
        refetchType: 'active',
      });
    } catch (error) {
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n' + error);
    }
  };

  const handleSendHandyPartyCancelled = async (reservationId: string) => {
    try {
      await sendHandyPartyCancelled(reservationId);
    } catch (error) {
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n' + error);
    }
  };

  return (
    <BlueButton onClick={handleClick} disabled={!isHandyParty}>
      핸디팟 무산 처리하기
    </BlueButton>
  );
};

export default CancelHandyPartyButton;
