import { AdminFeedbackResponseModel } from '@/types/feedback.type';
import { formatDateString } from '@/utils/date.util';
import { createColumnHelper } from '@tanstack/react-table';

const feedbackColumnHelper = createColumnHelper<AdminFeedbackResponseModel>();

export const feedbackColumns = [
  feedbackColumnHelper.accessor('createdAt', {
    header: () => '작성일',
    cell: (info) => formatDateString(info.getValue()),
  }),
  feedbackColumnHelper.accessor('subject', {
    header: () => '종류',
    cell: (info) => info.getValue(),
  }),
  feedbackColumnHelper.accessor('content', {
    header: () => '내용',
    cell: (info) => info.getValue(),
  }),
  feedbackColumnHelper.accessor('userId', {
    header: () => '유저 ID',
    cell: (info) => info.getValue(),
  }),
];
