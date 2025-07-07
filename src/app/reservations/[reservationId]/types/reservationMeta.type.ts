import { createColumnHelper } from '@tanstack/react-table';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { ReservationViewEntity } from '@/types/reservation.type';

const columnHelper = createColumnHelper<ReservationViewEntity>();

export const columns = [
  columnHelper.accessor('reservationId', {
    header: () => '예약 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('reservationStatus', {
    header: () => '예약 상태',
    cell: (info) => Stringifier.reservationStatus(info.getValue()),
  }),
  columnHelper.accessor('cancelStatus', {
    header: () => '예약 취소 상태',
    cell: (info) => Stringifier.cancelStatus(info.getValue()),
  }),
  columnHelper.accessor('type', {
    header: () => '예약 유형',
    cell: (info) => Stringifier.tripType(info.getValue()),
  }),
  columnHelper.accessor('passengerCount', {
    header: () => '탑승객 수',
    cell: (info) => info.getValue() + '인',
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
  columnHelper.accessor('metadata.desiredHubAddress', {
    header: () => '유저 입력 주소',
    cell: (info) => info.getValue() ?? '-',
  }),
  columnHelper.accessor('metadata.desiredHubLatitude', {
    header: () => '유저 입력 위도',
    cell: (info) => info.getValue() ?? '-',
  }),
  columnHelper.accessor('metadata.desiredHubLongitude', {
    header: () => '유저 입력 경도',
    cell: (info) => info.getValue() ?? '-',
  }),
];
