'use client';

import { ReservationPassengersInReservationsView } from '@/types/v2/reservation.type';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper =
  createColumnHelper<ReservationPassengersInReservationsView>();

export const columns = [
  columnHelper.accessor('passengerId', {
    header: () => '탑승객 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('passengerName', {
    header: () => '탑승객 이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('passengerPhoneNumber', {
    header: () => '탑승객 전화번호',
    cell: (info) => info.getValue(),
  }),
];
