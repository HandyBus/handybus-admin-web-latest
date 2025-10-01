import BlueLink from '@/components/link/BlueLink';
import { AdminFeedbackResponseModel } from '@/types/feedback.type';
import { formatDateString } from '@/utils/date.util';
import { createColumnHelper } from '@tanstack/react-table';

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
      const content = info.getValue();
      const target = content.split(', ')?.[1]?.split(': ')?.[1];
      return (
        <span className="whitespace-nowrap break-keep">{target ?? '-'}</span>
      );
    },
  }),
  cancelReasonColumnHelper.accessor('content', {
    header: () => '상세 내용',
    cell: (info) => {
      const content = info.getValue();
      const target = content.split(', ')?.[2]?.split(': ')?.[1];
      return target ?? '-';
    },
  }),
  cancelReasonColumnHelper.accessor('userId', {
    header: () => '상세보기',
    cell: (info) => {
      const userId = info.getValue();
      const reservationId = info.row.original.content
        .split(', ')?.[0]
        ?.split(': ')?.[1];
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
