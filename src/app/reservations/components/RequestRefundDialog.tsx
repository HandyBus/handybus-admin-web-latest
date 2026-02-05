import BlueButton from '@/components/link/BlueButton';
import {
  CancelStatus,
  HandyStatus,
  ReservationStatus,
  ReservationViewEntity,
} from '@/types/reservation.type';
import { Controller } from 'react-hook-form';
import { Description, Dialog, DialogTitle } from '@headlessui/react';
import { DialogPanel } from '@headlessui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AdminRequestRefundRequest,
  PaymentsViewEntity,
  RefundStatus,
} from '@/types/payment.type';
import {
  useGetUserPayment,
  usePostAdminRequestRefund,
  usePostCompleteRefundRequest,
} from '@/services/payment.service';
import { useQueryClient } from '@tanstack/react-query';
import { RefundRequestTypeEnum } from '@/types/payment.type';
import RefundTypeInput from './RefundTypeInput';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';

interface Props {
  reservation: ReservationViewEntity;
}

const RequestRefundDialog = ({ reservation }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useGetUserPayment(
    reservation.userId,
    reservation.paymentId ?? '',
    {
      enabled: isOpen,
    },
  );
  const payments = data?.payments;

  return (
    <>
      <BlueButton onClick={() => setIsOpen(true)}>환불 처리하기</BlueButton>
      {reservation.paymentId && payments && (
        <RefundForm
          reservation={reservation}
          payments={payments}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
};

export default RequestRefundDialog;

interface RefundFormProps {
  reservation: ReservationViewEntity;
  payments: PaymentsViewEntity;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const RefundForm = ({
  reservation,
  payments,
  isOpen,
  setIsOpen,
}: RefundFormProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync: postAdminRequestRefund } = usePostAdminRequestRefund();
  const { mutateAsync: postCompleteRefundRequest } =
    usePostCompleteRefundRequest();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminRequestRefundRequest>();

  const getFilteredRefundOptions = () => {
    if (reservation.cancelStatus === 'CANCEL_COMPLETE') {
      return RefundRequestTypeEnum.options.filter(
        (type) => type !== 'CANCEL' && type !== 'PAYBACK',
      );
    }
    return RefundRequestTypeEnum.options;
  };

  const onSubmit = async (data: AdminRequestRefundRequest) => {
    if (!reservation.paymentId) {
      alert('결제 정보가 없습니다.');
      return;
    }
    if (!confirm('환불 처리하시겠습니까?')) return;
    try {
      const res = await postAdminRequestRefund({
        paymentId: reservation.paymentId,
        body: {
          refundAmount: data.refundAmount,
          refundReason: data.refundReason,
          type: data.type,
        },
      });

      await postCompleteRefundRequest({
        paymentId: reservation.paymentId,
        refundRequestId: res.refundRequestId,
        body: {
          refundAmount: data.refundAmount,
        },
      });

      queryClient.invalidateQueries({
        queryKey: ['reservation'],
        refetchType: 'active',
      });

      alert('환불 처리가 완료되었습니다.');
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert('환불 처리가 실패했습니다.\n사유: ' + error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-basic-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
    >
      <DialogPanel className="space-y-8 rounded-16 bg-basic-white p-24">
        <DialogTitle className="text-26 font-700">환불 처리하기</DialogTitle>
        <Description>
          환불 유형에 따라 처리되며, 환불 금액은 PG사를 통해서 입금됩니다.
        </Description>
        <RefundInfo reservation={reservation} />
        <RefundHistory payments={payments} />
        <Spacer />
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <SectionTitle>환불 유형</SectionTitle>
          <Controller
            control={control}
            name="type"
            rules={{
              required: '환불 유형을 선택해주세요.',
            }}
            render={({ field: { onChange, value } }) => (
              <RefundTypeInput
                value={value}
                onChange={onChange}
                options={getFilteredRefundOptions()}
              />
            )}
          />
          {errors.type && (
            <p className="text-14 font-500 text-basic-red-500">
              {errors.type.message}
            </p>
          )}
          <SectionTitle>
            환불 금액 (환불 가능 금액{' '}
            <strong className="text-basic-red-500">
              {payments.refundableAmount?.toLocaleString()}원
            </strong>
            )
          </SectionTitle>
          <Controller
            control={control}
            name="refundAmount"
            rules={{
              required: '환불 금액을 입력해주세요.',
              pattern: {
                value: /^[0-9]+$/,
                message: '환불 금액은 숫자만 입력해주세요.',
              },
              min: {
                value: 1,
                message: '환불 금액은 0원 이상이어야 합니다.',
              },
              max: {
                value: payments.refundableAmount,
                message: `환불 금액은 최대 ${payments.refundableAmount?.toLocaleString()}원 입니다.`,
              },
            }}
            render={({ field: { onChange, value } }) => (
              <div className="flex flex-row items-center justify-between rounded-8 border border-basic-grey-100 bg-basic-white p-8">
                <input
                  value={value ? Number(value).toLocaleString() : ''}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    onChange(numericValue ? Number(numericValue) : '');
                  }}
                  className="w-full"
                  placeholder="0"
                />
              </div>
            )}
          />
          {errors.refundAmount && (
            <p className="text-14 font-500 text-basic-red-500">
              {errors.refundAmount.message}
            </p>
          )}
          <SectionTitle>환불 사유</SectionTitle>
          <Controller
            control={control}
            name="refundReason"
            rules={{
              required: '환불 사유를 입력해주세요.',
            }}
            render={({ field: { onChange, value } }) => (
              <div className="flex flex-row items-center justify-between rounded-8 border border-basic-grey-100 bg-basic-white p-8">
                <textarea
                  value={value}
                  onChange={onChange}
                  className="w-full resize-none"
                  placeholder="환불 사유를 입력해주세요."
                />
              </div>
            )}
          />
          {errors.refundReason && (
            <p className="text-14 font-500 text-basic-red-500">
              {errors.refundReason.message}
            </p>
          )}
          <div className="flex justify-end gap-4 text-basic-white [&>button]:rounded-8 [&>button]:px-16 [&>button]:py-4">
            <button
              type="button"
              className="bg-basic-grey-400 transition-all hover:scale-95 active:scale-90"
              onClick={() => setIsOpen(false)}
            >
              이 창 닫기
            </button>
            <button
              type="submit"
              className={`disab-basic-greyg-basic-grey-400 bg-basic-blue-400 transition-all ${
                isSubmitting
                  ? 'cursor-not-allowed'
                  : 'hover:scale-95 active:scale-90'
              }`}
              disabled={isSubmitting}
            >
              환불
            </button>
          </div>
        </form>
      </DialogPanel>
    </Dialog>
  );
};

const Spacer = () => {
  return <div className="h-16 w-full" />;
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-14 font-500">{children}</p>;
};

interface RefundInfoProps {
  reservation: ReservationViewEntity;
}
const RefundInfo = ({ reservation }: RefundInfoProps) => {
  const ShuttleRouteDate = reservation.shuttleRoute.event?.dailyEvents.find(
    (dailyEvent) =>
      dailyEvent.dailyEventId === reservation.shuttleRoute.dailyEventId,
  )?.dailyEventDate;

  const reservationStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'NOT_PAYMENT':
        return;
      case 'COMPLETE_PAYMENT':
        return 'text-brand-primary-400';
      case 'CANCEL':
        return 'text-basic-red-500';
    }
  };

  const cancelStatusColor = (status: CancelStatus) => {
    switch (status) {
      case 'NONE':
        return;
      case 'CANCEL_REQUEST':
        return 'text-basic-blue-400';
      case 'CANCEL_COMPLETE':
        return 'text-basic-red-500';
    }
  };

  const handyStatusColor = (status: HandyStatus) => {
    switch (status) {
      case 'NOT_SUPPORTED':
        return;
      case 'SUPPORTED':
        return 'text-basic-blue-400';
      case 'ACCEPTED':
        return 'text-brand-primary-400';
      case 'DECLINED':
        return 'text-basic-red-500';
    }
  };

  return (
    <div className="w-full rounded-8 border  border-basic-grey-100 bg-basic-white p-8 text-12 font-500 text-basic-grey-600 ">
      - 예약자명 : {reservation.userNickname}
      <br />- 예약자 연락처 : {reservation.userPhoneNumber}
      <br />- 예약 일시 : {formatDateString(reservation.createdAt, 'datetime')}
      <br />- 행사명 : {reservation.shuttleRoute.event?.eventName}
      <br />- 노선명 : {reservation.shuttleRoute.name}
      <br />- 노선일자 : {formatDateString(ShuttleRouteDate, 'date')}
      <br />- 결제 금액 : {reservation.paymentAmount?.toLocaleString()}원
      <br />- 예약 상태 :{' '}
      <span className={reservationStatusColor(reservation.reservationStatus)}>
        {Stringifier.reservationStatus(reservation.reservationStatus)}
      </span>
      <br />- 취소 상태 :{' '}
      <span className={cancelStatusColor(reservation.cancelStatus)}>
        {Stringifier.cancelStatus(reservation.cancelStatus)}
      </span>
      <br />- 핸디 상태 :{' '}
      <span className={handyStatusColor(reservation.handyStatus)}>
        {Stringifier.handyStatus(reservation.handyStatus)}
      </span>
    </div>
  );
};

interface RefundHistoryProps {
  payments: PaymentsViewEntity;
}
const RefundHistory = ({ payments }: RefundHistoryProps) => {
  const refundStatusColor = (status: RefundStatus) => {
    switch (status) {
      case 'REQUESTED':
        return 'text-basic-blue-400';
      case 'COMPLETED':
        return 'text-brand-primary-400';
      case 'FAILED':
        return 'text-basic-red-500';
    }
  };

  return (
    <>
      <p className="text-14 font-500">
        환불 내역 {payments.refundRequests?.length}건
      </p>
      <div className="h-60 w-full resize-y overflow-y-auto rounded-8 border border-basic-grey-100 bg-basic-white p-8 text-12 font-500 text-basic-grey-700">
        {payments.refundRequests && payments.refundRequests.length > 0
          ? payments.refundRequests.map((refundRequest, index) => {
              return (
                <div key={refundRequest.refundRequestId}>
                  {index + 1} 번째 요청 | 환불요청상태 :{' '}
                  <span className={refundStatusColor(refundRequest.status)}>
                    {Stringifier.refundStatus(refundRequest.status)}
                  </span>
                  <br /> 환불완료일자 :{' '}
                  {formatDateString(refundRequest.refundAt, 'date')}
                  <br />
                  환불요청금액 :{' '}
                  <span className="text-basic-red-500">
                    {refundRequest.refundAmount.toLocaleString()}원
                  </span>
                  <br />
                  환불가능금액 :{' '}
                  {refundRequest.previousRefundableAmount.toLocaleString()}원
                  <br />
                  환불요청사유 : {refundRequest.refundReason}
                  <br />
                  ----------------------------------
                </div>
              );
            })
          : '환불 내역이 없습니다.'}
      </div>
    </>
  );
};
