'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { type BusType } from '@/types/v1/bus.type';
import BlueLink from '@/components/link/BlueLink';
import dayjs from 'dayjs';
import { RouteHubType } from '@/types/v1/routeHub.type';

const busColumnHelper = createColumnHelper<BusType>();

export const busColumns = [
  busColumnHelper.accessor('shuttleBusId', {
    header: () => 'ID',
    cell: (info) => info.getValue,
  }),
  busColumnHelper.accessor('type', {
    header: () => 'type',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('name', {
    header: () => '호차',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('phoneNumber', {
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

const routeHubColumnHelper = createColumnHelper<RouteHubType>();

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
    cell: (info) => dayjs(info.getValue()).format('YYYY-MM-DD HH:mm:ss'),
  }),
];
