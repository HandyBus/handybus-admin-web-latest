import BlueLink from '@/components/link/BlueLink';
import { AdminFeedbackResponseModel } from '@/types/feedback.type';
import { formatDateString } from '@/utils/date.util';
import { createColumnHelper } from '@tanstack/react-table';
import {
  parseCancelReasonContent,
  UNKNOWN_DETAIL,
  UNKNOWN_REASON,
} from './utils/cancelReasonContent.util';

const cancelReasonColumnHelper =
  createColumnHelper<AdminFeedbackResponseModel>();

const getCancelReasonDisplayData = (content: string) => {
  const parsed = parseCancelReasonContent(content);

  return {
    reservationId: parsed.reservationId ?? '',
    reason: parsed.reason || UNKNOWN_REASON,
    detail: parsed.detail || UNKNOWN_DETAIL,
  };
};

export const cancelReasonColumns = [
  cancelReasonColumnHelper.accessor('createdAt', {
    header: () => '작성일',
    cell: (info) => (
      <span className="whitespace-nowrap break-keep">
        {formatDateString(info.getValue(), 'datetime')}
      </span>
    ),
  }),
  cancelReasonColumnHelper.accessor('content', {
    header: () => '취소 사유',
    cell: (info) => {
      const { reason } = getCancelReasonDisplayData(info.getValue());
      return <span className="whitespace-nowrap break-keep">{reason}</span>;
    },
  }),
  cancelReasonColumnHelper.accessor('content', {
    header: () => '상세 내용',
    cell: (info) => {
      const { detail } = getCancelReasonDisplayData(info.getValue());
      return detail === UNKNOWN_DETAIL ? '-' : detail;
    },
  }),
  cancelReasonColumnHelper.accessor('userId', {
    header: () => '상세보기',
    cell: (info) => {
      const userId = info.getValue();
      const { reservationId } = getCancelReasonDisplayData(
        info.row.original.content,
      );
      return (
        <div className="flex flex-col items-center">
          <BlueLink href={`/users/${userId}`}>유저 상세보기</BlueLink>
          {reservationId ? (
            <BlueLink href={`/reservations/${reservationId}`}>
              예약 상세보기
            </BlueLink>
          ) : (
            <span className="text-12 text-basic-grey-400">예약 정보 없음</span>
          )}
        </div>
      );
    },
  }),
];
