'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { PassengerType } from '@/types/v1/passenger.type';

const columnHelper = createColumnHelper<PassengerType>();

export const columns = [
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('phoneNumber', {
    header: () => '휴대폰 번호',
    cell: (info) => info.getValue(),
  }),
];
