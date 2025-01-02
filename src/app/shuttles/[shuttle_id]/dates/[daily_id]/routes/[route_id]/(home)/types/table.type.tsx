'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { type BusType } from '@/types/bus.type';
import BlueLink from '@/components/link/BlueLink';
import dayjs from 'dayjs';
import { RouteHubType } from '@/types/routeHub.type';

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
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('phoneNumber', {
    header: () => '상태',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.display({
    id: 'actions',
    header: () => '액션',
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
