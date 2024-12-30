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
    cell: (info) => {
      switch (info.getValue()) {
        case 'TO_DESTINATION':
          return '목적지행';
        case 'FROM_DESTINATION':
          return '귀가';
        case 'ROUND_TRIP':
          return '왕복';
      }
    },
  }),
  columnHelper.accessor('handyStatus', {
    header: () => 'handyStatus',
    cell: (info) => {
      switch (info.getValue()) {
        case 'ACCEPTED':
          return '승인됨';
        case 'DECLINED':
          return '거절됨';
        case 'NOT_SUPPORTED':
          return '-';
        case 'SUPPORTED':
          return '지원';
      }
    },
  }),
  columnHelper.accessor('cancelStatus', {
    header: () => 'cancelStatus',
    cell: (info) => {
      switch (info.getValue()) {
        case 'CANCEL_COMPLETE':
          return '취소 완료';
        case 'CANCEL_REQUEST':
          return '취소 요청';
        case 'NONE':
          return '-';
      }
    },
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
    cell: (info) => {
      switch (info.getValue()) {
        case 'COMPLETE_PAYMENT':
          return '결제 완료';
        case 'NOT_PAYMENT':
          return '결제 안됨';
        case 'RESERVATION_CONFIRMED':
          return '예약 확정';
        case 'CANCEL':
          return '취소됨';
      }
    },
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
    header: () => 'passengers.length',
    cell: (info) => info.getValue().length,
  }),
  columnHelper.accessor('toDestinationShuttleRouteHubId', {
    header: () => 'toDestination',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('fromDestinationShuttleRouteHubId', {
    header: () => 'fromDestination',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('shuttleRoute.shuttleId', {
    header: () => 'shuttleId',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('shuttleRoute.dailyShuttleId', {
    header: () => 'dailyShuttleId',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('shuttleRoute.shuttleRouteId', {
    header: () => 'r', //'shuttleRouteId',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => '액션',
    cell: (props) => (
      <BlueLink href={`/reservations/${props.row.original.reservationId}`}>
        상세보기
      </BlueLink>
    ),
  }),
];
