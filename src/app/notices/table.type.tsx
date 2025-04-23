import BlueLink from '@/components/link/BlueLink';
import { createColumnHelper } from '@tanstack/react-table';

type Notice = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const columnHelper = createColumnHelper<Notice>();

export const columns = [
  columnHelper.accessor('title', {
    header: () => '제목',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('content', {
    header: () => '내용',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: () => '작성일',
  }),
  columnHelper.accessor('updatedAt', {
    header: () => '수정일',
  }),
  columnHelper.display({
    id: 'actions',
    header: () => 'actions',
    cell: (info) => (
      <BlueLink href={`/notices/${info.row.original.id}`}>상세보기</BlueLink>
    ),
  }),
];
