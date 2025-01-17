import { ReservationView } from '@/types/v2/reservation.type';
import { createColumnHelper } from '@tanstack/react-table';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';

const columnHelper = createColumnHelper<ReservationView>();

export const columns = [
  columnHelper.accessor('reservationId', {
    header: () => '탑승객 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('reservationStatus', {
    header: () => '예약 상태',
    cell: (info) => Stringifier.reservationStatus(info.getValue()),
  }),
  columnHelper.accessor('cancelStatus', {
    header: () => '환불 상태',
    cell: (info) => Stringifier.cancelStatus(info.getValue()),
  }),
  columnHelper.accessor('type', {
    header: () => '예약 유형',
    cell: (info) => Stringifier.reservationType(info.getValue()),
  }),
  columnHelper.accessor('handyStatus', {
    header: () => '핸디 상태',
    cell: (info) => Stringifier.handyStatus(info.getValue()),
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.accessor('updatedAt', {
    header: () => '수정일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
];
