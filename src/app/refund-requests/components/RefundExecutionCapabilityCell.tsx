'use client';

import { PaymentsViewEntity } from '@/types/payment.type';
import Stringifier from '@/utils/stringifier.util';

interface RefundExecutionCapabilityCellProps {
  payment?: PaymentsViewEntity | null;
}

const RefundExecutionCapabilityCell = ({
  payment,
}: RefundExecutionCapabilityCellProps) => {
  if (payment) {
    return (
      <span className="whitespace-nowrap break-keep">
        {Stringifier.refundExecutionCapability(
          payment.refundExecutionCapability,
        )}
      </span>
    );
  }
  return <span className="text-14 text-basic-red-500">-</span>;
};

export default RefundExecutionCapabilityCell;
