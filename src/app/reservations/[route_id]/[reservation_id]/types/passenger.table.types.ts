'use client';

import { createColumnHelper } from '@tanstack/react-table';

type Passenger = {
  name: string;
  phoneNumber: string;
};

const columnHelper = createColumnHelper<Passenger>();

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
