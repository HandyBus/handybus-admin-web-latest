'use client';

import { useState } from 'react';
import { RefundRequestReadModel } from '@/types/refund-request.type';
import { useGetPayment } from '@/services/payment.service';
import BlueButton from '@/components/link/BlueButton';
import BlueLink from '@/components/link/BlueLink';
import CompleteManualRefundDialog from './CompleteManualRefundDialog';
import CompleteAutoRefundDialog from './CompleteAutoRefundDialog';

interface Props {
  refundRequest: RefundRequestReadModel;
}

const CompleteRefundCell = ({ refundRequest }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: payment, isPending } = useGetPayment(refundRequest.paymentId);

  const canShowButton = refundRequest.status === 'REQUESTED' && payment;
  const isAuto = payment?.refundExecutionCapability === 'AUTO';
  const isManual = payment?.refundExecutionCapability === 'MANUAL';

  if (isPending) {
    return <span className="text-14 text-basic-grey-500">-</span>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {payment?.reservationId && (
        <BlueLink href={`/reservations/${payment.reservationId}`}>
          예약 상세보기
        </BlueLink>
      )}
      {canShowButton ? (
        <>
          <BlueButton onClick={() => setIsDialogOpen(true)}>
            {isAuto ? '자동 환불 처리' : '수동 환불 처리'}
          </BlueButton>
          {isAuto ? (
            <CompleteAutoRefundDialog
              refundRequest={refundRequest}
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
            />
          ) : isManual ? (
            <CompleteManualRefundDialog
              refundRequest={refundRequest}
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
    </div>
  );
};

export default CompleteRefundCell;
