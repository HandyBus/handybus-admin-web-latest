'use client';

import { ReservationType } from '@/types/reservation.type';
import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<ReservationType>();

export const columns = [
  columnHelper.accessor('reservationId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: () => 'type',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('handyStatus', {
    header: () => 'handyStatus',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('cancelStatus', {
    header: () => 'cancelStatus',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => info.getValue().toLocaleDateString(),
  }),
  columnHelper.accessor('updatedAt', {
    header: () => '수정일',
    cell: (info) => info.getValue().toLocaleDateString(),
  }),
  columnHelper.accessor('reservationStatus', {
    header: () => 'reservationStatus',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('payment.paymentId', {
    header: () => 'paymentId',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('payment.paymentAmount', {
    header: () => 'paymentAmount',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('user', {
    header: () => 'user',
    cell: (info) => JSON.stringify(info.getValue(), null, 2),
  }),
  columnHelper.accessor('passengers', {
    header: () => 'passengers',
    cell: (info) => JSON.stringify(info.getValue(), null, 2),
  }),
  columnHelper.accessor('pickupHubId', {
    header: () => 'pickupHubId',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('dropoffHubId', {
    header: () => 'dropoffHubId',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => '액션',
    cell: (props) => (
      <BlueLink href={'/TODO'}>
        TODO {props.row.original.reservationId}
      </BlueLink>
    ),
  }),
];
