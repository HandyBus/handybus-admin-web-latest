'use client';

import { useState } from 'react';
import { RefundRequestReadModel } from '@/types/refund-request.type';
import { useGetPayment } from '@/services/payment.service';
import BlueButton from '@/components/link/BlueButton';
import CompleteManualRefundDialog from './CompleteManualRefundDialog';

interface CompleteManualRefundCellProps {
  refundRequest: RefundRequestReadModel;
}

const CompleteManualRefundCell = ({
  refundRequest,
}: CompleteManualRefundCellProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: payment, isPending } = useGetPayment(refundRequest.paymentId);

  const canShowButton =
    refundRequest.status === 'REQUESTED' &&
    payment?.refundExecutionCapability !== 'AUTO';

  if (isPending || !canShowButton) {
    return <span className="text-14 text-basic-grey-500">-</span>;
  }

  return (
    <>
      <BlueButton onClick={() => setIsDialogOpen(true)}>
        수동 환불 처리
      </BlueButton>
      <CompleteManualRefundDialog
        refundRequest={refundRequest}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default CompleteManualRefundCell;
