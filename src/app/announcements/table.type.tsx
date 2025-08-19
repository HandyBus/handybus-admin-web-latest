import BlueLink from '@/components/link/BlueLink';
import { AdminAnnouncementResponseModel } from '@/types/announcement.type';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

const columnHelper = createColumnHelper<AdminAnnouncementResponseModel>();

export const columns = [
  columnHelper.accessor('title', {
    header: () => '제목',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: () => '작성일',
    cell: (info) => dayjs(info.getValue()).format('YYYY-MM-DD HH:mm'),
  }),
  columnHelper.accessor('updatedAt', {
    header: () => '수정일',
    cell: (info) => dayjs(info.getValue()).format('YYYY-MM-DD HH:mm'),
  }),
  columnHelper.accessor('deletedAt', {
    header: () => '삭제 유무',
    cell: (info) => (info.getValue() ? '삭제됨' : ''),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => 'actions',
    cell: (info) => (
      <BlueLink href={`/announcements/${info.row.original.id}`}>
        상세보기
      </BlueLink>
    ),
  }),
];
