'use client';

import { createColumnHelper } from '@tanstack/react-table';
import type { ShuttleBusesView } from '@/types/v2/shuttleBus.type';
import BlueLink from '@/components/link/BlueLink';
import { ShuttleRouteHubsInShuttleRoutesView } from '@/types/v2/shuttleRoute.type';
import { formatDateString } from '@/utils/date.util';

const busColumnHelper = createColumnHelper<ShuttleBusesView>();

export const busColumns = [
  busColumnHelper.accessor('shuttleBusId', {
    header: () => 'ID',
    cell: (info) => info.getValue,
  }),
  busColumnHelper.accessor('busType', {
    header: () => 'type',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('busName', {
    header: () => '호차',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('busDriverPhoneNumber', {
    header: () => '기사님 전화번호',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.display({
    id: 'actions',
    header: () => '오픈채팅방 링크',
    cell: () => (
      // TODO: href={props.row.original.openChatLink}>
      <BlueLink href="TODO">오픈채팅 링크 열기</BlueLink>
    ),
  }),
];

const routeHubColumnHelper =
  createColumnHelper<ShuttleRouteHubsInShuttleRoutesView>();

export const routeHubColumns = [
  routeHubColumnHelper.accessor('shuttleRouteHubId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  routeHubColumnHelper.accessor('name', {
    header: () => 'name',
    cell: (info) => info.getValue(),
  }),
  routeHubColumnHelper.accessor('sequence', {
    header: () => '순서',
    cell: (info) => info.getValue(),
  }),
  routeHubColumnHelper.accessor('arrivalTime', {
    header: () => '도착시간',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
];
