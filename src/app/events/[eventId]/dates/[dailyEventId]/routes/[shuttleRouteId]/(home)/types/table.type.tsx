'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { formatDateString } from '@/utils/date.util';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';
import { ShuttleRouteHubsInShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';

const busColumnHelper = createColumnHelper<ShuttleBusesViewEntity>();

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
  createColumnHelper<ShuttleRouteHubsInShuttleRoutesViewEntity>();

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
