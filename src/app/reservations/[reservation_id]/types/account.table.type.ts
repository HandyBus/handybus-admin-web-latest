import { ReservationView } from '@/types/v2/reservation.type';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ReservationView>();

export const accountColumns = [
  columnHelper.accessor('userId', {
    header: '사용자 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('userNickname', {
    header: '닉네임',
    cell: (info) => info.getValue() ?? '-',
  }),
  columnHelper.accessor('userPhoneNumber', {
    header: '전화번호',
    cell: (info) => info.getValue() ?? '-',
  }),
];
