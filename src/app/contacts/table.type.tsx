'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { formatDateString } from '@/utils/date.util';
import { AdminContactResponseModel } from '@/types/contact.type';

const columnHelper = createColumnHelper<AdminContactResponseModel>();

export const columns = [
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('company', {
    header: () => '회사',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('phoneNumber', {
    header: () => '전화번호',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: () => '이메일',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('title', {
    header: () => '제목',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.display({
    id: 'actions',
    header: '액션',
    cell: (props) => (
      <>
        <BlueLink href={`/contacts/${props.row.original.id}`}>
          상세보기
        </BlueLink>
      </>
    ),
  }),
];
