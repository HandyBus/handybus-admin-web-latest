'use client';

import { useGetPayment } from '@/services/payment.service';
import Stringifier from '@/utils/stringifier.util';

interface RefundExecutionCapabilityCellProps {
  paymentId: string;
}

const RefundExecutionCapabilityCell = ({
  paymentId,
}: RefundExecutionCapabilityCellProps) => {
  const { data: payment, isPending, isError } = useGetPayment(paymentId);

  if (isPending) {
    return <span className="text-14 text-basic-grey-500">조회 중</span>;
  }
  if (isError || !payment) {
    return <span className="text-14 text-basic-red-500">-</span>;
  }
  return (
    <span className="whitespace-nowrap break-keep">
      {Stringifier.refundExecutionCapability(payment.refundExecutionCapability)}
    </span>
  );
};

export default RefundExecutionCapabilityCell;
