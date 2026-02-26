import BlueLink from '@/components/link/BlueLink';
import { AdminFeedbackResponseModel } from '@/types/feedback.type';
import { formatDateString } from '@/utils/date.util';
import { createColumnHelper } from '@tanstack/react-table';
import { parseCancelReasonContent } from './cancelReasonContent.util';

const cancelReasonColumnHelper =
  createColumnHelper<AdminFeedbackResponseModel>();

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
      const { reason } = parseCancelReasonContent(info.getValue());
      return <span className="whitespace-nowrap break-keep">{reason}</span>;
    },
  }),
  cancelReasonColumnHelper.accessor('content', {
    header: () => '상세 내용',
    cell: (info) => {
      const { detail } = parseCancelReasonContent(info.getValue());
      return detail === '상세 미입력' ? '-' : detail;
    },
  }),
  cancelReasonColumnHelper.accessor('userId', {
    header: () => '상세보기',
    cell: (info) => {
      const userId = info.getValue();
      const { reservationId } = parseCancelReasonContent(
        info.row.original.content,
      );
      return (
        <div className="flex flex-col items-center">
          <BlueLink href={`/users/${userId}`}>유저 상세보기</BlueLink>
          <BlueLink href={`/reservations/${reservationId}`}>
            예약 상세보기
          </BlueLink>
        </div>
      );
    },
  }),
];
