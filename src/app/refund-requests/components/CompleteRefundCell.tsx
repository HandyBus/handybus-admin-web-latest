'use client';

import { useState } from 'react';
import { RefundRequestTableRow } from '../table.type';
import BlueButton from '@/components/link/BlueButton';
import BlueLink from '@/components/link/BlueLink';
import CompleteManualRefundDialog from './CompleteManualRefundDialog';
import CompleteAutoRefundDialog from './CompleteAutoRefundDialog';
import { PaymentsViewEntity } from '@/types/payment.type';
import { usePostDeactivateRefundRequest } from '@/services/refund-request.service';

interface CompleteRefundCellProps {
  refundRequest: RefundRequestTableRow;
  payment?: PaymentsViewEntity;
}

const CompleteRefundCell = ({
  refundRequest,
  payment,
}: CompleteRefundCellProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    mutateAsync: postDeactivateRefundRequest,
    isPending: isDeactivating,
  } = usePostDeactivateRefundRequest();

  const handleDeactivate = async () => {
    const confirm = window.confirm(
      '환불 요청을 비활성화하시겠습니까?\n비활성화 후 환불 요청을 처리할 수 없으며, 다시 활성화 시킬 수 없습니다.',
    );
    if (!confirm) {
      return;
    }
    if (!refundRequest.paymentId || !refundRequest.id) {
      return;
    }

    try {
      await postDeactivateRefundRequest({
        paymentId: refundRequest.paymentId,
        refundRequestId: refundRequest.id,
      });
      alert('환불 요청이 비활성화되었습니다.');
    } catch (error) {
      console.error(error);
      alert('환불 요청 비활성화에 실패했습니다.\n사유: ' + error);
    }
  };

  const canShowRefundButton = refundRequest.status === 'REQUESTED' && payment;
  const canShowDeactivateButton = refundRequest.isActive === true;
  const isAuto = payment?.refundExecutionCapability === 'AUTO';
  const isManual = payment?.refundExecutionCapability === 'MANUAL';

  return (
    <div className="flex flex-col items-center gap-4">
      {payment?.reservationId && (
        <BlueLink href={`/reservations/${payment.reservationId}`}>
          예약 상세보기
        </BlueLink>
      )}
      {canShowRefundButton ? (
        <>
          <BlueButton onClick={() => setIsDialogOpen(true)}>
            {isAuto ? '자동 환불 처리' : '수동 환불 처리'}
          </BlueButton>
          {isAuto ? (
            <CompleteAutoRefundDialog
              refundRequest={refundRequest}
              payment={payment}
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
            />
          ) : isManual ? (
            <CompleteManualRefundDialog
              refundRequest={refundRequest}
              payment={payment}
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
            />
          ) : (
            <span className="text-14 text-basic-grey-500">-</span>
          )}
        </>
      ) : (
        <span className="text-14 text-basic-grey-500">-</span>
      )}
      {canShowDeactivateButton ? (
        <BlueButton
          className="text-12"
          onClick={handleDeactivate}
          disabled={isDeactivating}
        >
          비활성화
        </BlueButton>
      ) : (
        <span className="text-14 text-basic-grey-500">-</span>
      )}
    </div>
  );
};

export default CompleteRefundCell;
