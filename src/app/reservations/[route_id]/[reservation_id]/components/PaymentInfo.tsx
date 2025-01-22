import {
  paymentColumns,
  refundRequestColumns,
  tosspaymentsCancelColumns,
  tosspaymentsCashReceiptsColumns,
  tosspaymentsColumns,
} from '../types/payment.table.type';
import Guide from '@/components/guide/Guide';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import VerticalTable from '@/components/table/VerticalTable';
import { ReservationViewEntity } from '@/types/reservation.type';
import { PaymentsViewEntity, TossPaymentsEntity } from '@/types/payment.type';

interface Props {
  response: {
    reservation: ReservationViewEntity;
    payment: PaymentsViewEntity;
    tossPayments: TossPaymentsEntity;
  };
}

const PaymentInfo = ({ response }: Props) => {
  const paymentTable = useTable({
    data: [response.payment],
    columns: paymentColumns,
  });

  const refundRequestTable = useTable({
    data: response.payment.refundRequests ?? [],
    columns: refundRequestColumns,
  });

  const tosspaymentsTable = useTable({
    data: [response.tossPayments],
    columns: tosspaymentsColumns,
  });

  const tosspaymentsCancelTable = useTable({
    data: response.tossPayments?.cancels ? [response.tossPayments.cancels] : [],
    columns: tosspaymentsCancelColumns,
  });

  const tosspaymentsCashReceiptsTable = useTable({
    data: response.tossPayments?.cashReceipts
      ? [response.tossPayments.cashReceipts]
      : [],
    columns: tosspaymentsCashReceiptsColumns,
  });

  return (
    <>
      <details open>
        <summary className="text-[18px] font-500 py-8">결제정보</summary>
        {response.payment ? (
          <div className="flex flex-col gap-8 w-full">
            <VerticalTable table={paymentTable} />
            {response.payment.refundRequests &&
              response.payment.refundRequests.length > 0 && (
                <>
                  <h2 className="text-[18px] font-500">결제정보 - 환불정보</h2>
                  <BaseTable table={refundRequestTable} />
                </>
              )}
          </div>
        ) : (
          <Guide> 결제정보가 없습니다.</Guide>
        )}
      </details>
      <details open>
        <summary className="text-[18px] font-500 py-8">토스 결제정보</summary>
        {response.tossPayments ? (
          <div className="flex flex-col gap-8 w-full">
            <VerticalTable table={tosspaymentsTable} />
          </div>
        ) : (
          <Guide> 토스 결제정보가 없습니다.</Guide>
        )}
        {response.tossPayments?.cancels &&
          response.tossPayments?.cancels.length > 0 && (
            <details>
              <summary className="text-[14px] font-400 p-8">
                토스 결제정보 - 토스 취소 정보 TosspaymentsCancel
              </summary>
              {response.tossPayments?.cancels.map((cancel) => (
                <div key={cancel.cancelRequestId}>
                  <p>환불 요청 ID: {cancel.cancelRequestId}</p>
                  <BaseTable table={tosspaymentsCancelTable} />
                </div>
              ))}
            </details>
          )}
        {response.tossPayments?.cashReceipts &&
          response.tossPayments?.cashReceipts.length > 0 && (
            <details>
              <summary className="text-[16px] font-400 p-8">
                토스 결제정보 -토스 영수증 정보 TosspaymentsCashReceipts
              </summary>
              {response.tossPayments?.cashReceipts.map((cashReceipt) => (
                <div key={cashReceipt.receiptKey}>
                  <p>영수증 ID: {cashReceipt.receiptKey}</p>
                  <BaseTable table={tosspaymentsCashReceiptsTable} />
                </div>
              ))}
            </details>
          )}
      </details>
    </>
  );
};

export default PaymentInfo;
