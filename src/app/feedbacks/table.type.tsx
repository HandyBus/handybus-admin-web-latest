import BlueLink from '@/components/link/BlueLink';
import { AdminFeedbackResponseModel } from '@/types/feedback.type';
import { formatDateString } from '@/utils/date.util';
import { createColumnHelper } from '@tanstack/react-table';

const feedbackColumnHelper = createColumnHelper<AdminFeedbackResponseModel>();

export const feedbackColumns = [
  feedbackColumnHelper.accessor('createdAt', {
    header: () => '작성일',
    cell: (info) => (
      <span className="whitespace-nowrap break-keep">
        {formatDateString(info.getValue(), 'datetime')}
      </span>
    ),
  }),
  feedbackColumnHelper.accessor('subject', {
    header: () => '종류',
    cell: (info) => (
      <span className="whitespace-nowrap break-keep font-500">
        {info.getValue()}
      </span>
    ),
  }),
  feedbackColumnHelper.accessor('content', {
    header: () => '내용',
    cell: (info) => info.getValue(),
  }),
  feedbackColumnHelper.accessor('userId', {
    header: () => '유저 상세보기',
    cell: (info) => (
      <BlueLink href={`/users/${info.getValue()}`}>유저 상세보기</BlueLink>
    ),
  }),
];
