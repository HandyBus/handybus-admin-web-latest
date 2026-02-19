'use client';

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { RefundRequestReadModel } from '@/types/refund-request.type';
import { getPayment } from '@/services/payment.service';
import { usePostCompleteAutoRefundRequest } from '@/services/refund-request.service';
import { useQuery } from '@tanstack/react-query';
import Stringifier from '@/utils/stringifier.util';

interface CompleteAutoRefundDialogProps {
  refundRequest: RefundRequestReadModel | null;
  isOpen: boolean;
  onClose: () => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-14 font-500">{children}</p>
);

const CompleteAutoRefundDialog = ({
  refundRequest,
  isOpen,
  onClose,
}: CompleteAutoRefundDialogProps) => {
  const paymentId = refundRequest?.paymentId ?? '';
  const { data: payment, isPending: isPaymentPending } = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => getPayment(paymentId),
    enabled: isOpen && Boolean(paymentId),
  });

  const { mutateAsync: postCompleteAutoRefund, isPending: isSubmitting } =
    usePostCompleteAutoRefundRequest(onClose);

  const handleSubmit = async () => {
    if (!refundRequest) return;
    if (!confirm('환불을 자동 완료 처리하시겠습니까?')) return;
    try {
      await postCompleteAutoRefund({
        paymentId: refundRequest.paymentId,
        refundRequestId: refundRequest.id,
        body: { refundAmount: refundRequest.refundAmount },
      });
      alert('환불이 자동 완료 처리되었습니다.');
    } catch (error) {
      console.error(error);
      alert('환불이 자동 완료 처리에 실패했습니다.\n사유: ' + error);
    }
  };

  if (!refundRequest) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-basic-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
    >
      <DialogPanel className="space-y-8 rounded-16 bg-basic-white p-24">
        <DialogTitle className="text-26 font-700">자동 환불 처리</DialogTitle>
        <Description>
          자동 환불 완료 처리 시 결제 수단으로 즉시 환불됩니다.
        </Description>
        <div className="space-y-6 rounded-8 border border-basic-grey-100 bg-basic-white p-12 text-14 font-500 text-basic-grey-700">
          <SectionTitle>환불 실행 유형:</SectionTitle>
          <p className="text-basic-grey-800 pb-8">
            {isPaymentPending
              ? '조회 중...'
              : payment
                ? Stringifier.refundExecutionCapability(
                    payment.refundExecutionCapability,
                  )
                : '-'}
          </p>
          <SectionTitle>환불 금액:</SectionTitle>
          <p className="text-basic-grey-800">
            {refundRequest.refundAmount.toLocaleString()}원
          </p>
        </div>
        <div className="flex justify-end gap-4 text-basic-white [&>button]:rounded-8 [&>button]:px-16 [&>button]:py-4">
          <button
            type="button"
            className="bg-basic-grey-400 transition-all hover:scale-95 active:scale-90"
            onClick={onClose}
          >
            이 창 닫기
          </button>
          <button
            type="button"
            className={`bg-basic-blue-400 transition-all ${
              isSubmitting
                ? 'cursor-not-allowed'
                : 'hover:scale-95 active:scale-90'
            }`}
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            자동 환불 완료
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default CompleteAutoRefundDialog;
