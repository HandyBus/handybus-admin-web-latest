import BlueButton from '@/components/link/BlueButton';
import { ReservationViewEntity } from '@/types/reservation.type';
import { Controller } from 'react-hook-form';
import { Description, Dialog, DialogTitle } from '@headlessui/react';
import { DialogPanel } from '@headlessui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminRequestRefundRequest } from '@/types/payment.type';
import {
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
  if (!reservation) return null;
  return <RefundForm reservation={reservation} />;
};

export default RequestRefundDialog;

const RefundForm = ({ reservation }: Props) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminRequestRefundRequest>({
    defaultValues: {
      refundReason: undefined,
      refundAmount: reservation.paymentAmount ?? undefined,
      type: undefined,
    },
  });

  const { mutateAsync: postAdminRequestRefund } = usePostAdminRequestRefund();

  const { mutateAsync: postCompleteRefundRequest } =
    usePostCompleteRefundRequest();

  const onSubmit = async (data: AdminRequestRefundRequest) => {
    if (!reservation.paymentId) {
      alert('결제 정보가 없습니다.');
      return;
    }
    try {
      const res = await postAdminRequestRefund({
        paymentId: reservation.paymentId,
        body: {
          refundAmount: data.refundAmount,
          refundReason: data.refundReason,
          type: data.type,
        },
      });
      console.log(res);
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

  const getFilteredRefundOptions = () => {
    if (reservation.cancelStatus === 'CANCEL_COMPLETE') {
      return RefundRequestTypeEnum.options.filter(
        (type) => type !== 'CANCEL' && type !== 'PAYBACK',
      );
    }
    return RefundRequestTypeEnum.options;
  };

  const ShuttleRouteDate = reservation.shuttleRoute.event?.dailyEvents.find(
    (dailyEvent) =>
      dailyEvent.dailyEventId === reservation.shuttleRoute.dailyEventId,
  )?.date;

  return (
    <>
      <BlueButton onClick={() => setIsOpen(true)}>환불 처리하기</BlueButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="space-y-8 rounded-xl bg-white p-24">
          <DialogTitle className="text-26 font-700">환불 처리하기</DialogTitle>
          <Description>
            환불 처리 할 금액을 입력해주세요. 예약 건당 누적 최대{' '}
            <strong className="text-red-500">
              {reservation.paymentAmount}원
            </strong>
            까지 환불 가능합니다.
          </Description>
          <Description>
            환불 유형에 따라 처리되며, 환불 금액은 PG사를 통해서 입금됩니다.
          </Description>
          <Description>
            - 예약자명 : {reservation.userNickname}
            <br />- 예약자 연락처 : {reservation.userPhoneNumber}
            <br />- 예약 일시 :{' '}
            {formatDateString(reservation.createdAt, 'datetime')}
            <br />- 행사명 : {reservation.shuttleRoute.event?.eventName}
            <br />- 노선명 : {reservation.shuttleRoute.name}
            <br />- 노선일자 : {formatDateString(ShuttleRouteDate, 'date')}
            <br />- 예약 상태 :{' '}
            {Stringifier.reservationStatus(reservation.reservationStatus)}
            <br />- 환불 상태 :{' '}
            {Stringifier.cancelStatus(reservation.cancelStatus)}
            <br />- 핸디 상태 :{' '}
            {Stringifier.handyStatus(reservation.handyStatus)}
          </Description>
          <div className="h-16 w-full " />
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-14 font-500">환불 유형</p>
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
              <p className="text-14 font-500 text-red-500">
                {errors.type.message}
              </p>
            )}
            <p className="font-500\\ text-14">환불 금액</p>
            <div className="flex flex-row items-center justify-between rounded-lg border border-grey-100 bg-white p-8">
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
                    value: reservation.paymentAmount ?? 0,
                    message: `환불 금액은 최대 ${reservation.paymentAmount}원 입니다.`,
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <input value={value} onChange={onChange} className="w-full" />
                )}
              />
            </div>
            {errors.refundAmount && (
              <p className="text-14 font-500 text-red-500">
                {errors.refundAmount.message}
              </p>
            )}
            <p className="text-14 font-500">환불 사유</p>
            <div className="flex flex-row items-center justify-between rounded-lg border border-grey-100 bg-white p-8">
              <Controller
                control={control}
                name="refundReason"
                rules={{
                  required: '환불 사유를 입력해주세요.',
                }}
                render={({ field: { onChange, value } }) => (
                  <textarea
                    value={value}
                    onChange={onChange}
                    className="w-full resize-none"
                    placeholder="환불 사유를 입력해주세요."
                  />
                )}
              />
            </div>
            {errors.refundReason && (
              <p className="text-14 font-500 text-red-500">
                {errors.refundReason.message}
              </p>
            )}
            <div className="flex justify-end gap-4 text-white [&>button]:rounded-lg [&>button]:px-16 [&>button]:py-4">
              <button
                type="button"
                className="bg-grey-400 transition-all hover:scale-95 active:scale-90"
                onClick={() => setIsOpen(false)}
              >
                이 창 닫기
              </button>
              <button
                type="submit"
                className="bg-blue-400 transition-all hover:scale-95 active:scale-90"
              >
                환불
              </button>
            </div>
          </form>
        </DialogPanel>
      </Dialog>
    </>
  );
};
