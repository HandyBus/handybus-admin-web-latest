'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { formatDateString } from '@/utils/date.util';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';
import { ShuttleRouteHubsInShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';

type ExtendedShuttleBusesViewEntity = ShuttleBusesViewEntity & {
  eventId: string;
  dailyEventId: string;
  shuttleRouteId: string;
};

const busColumnHelper = createColumnHelper<ExtendedShuttleBusesViewEntity>();

export const busColumns = [
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
    cell: (info) =>
      info.row.original.openChatLink ? (
        <BlueLink
          href={info.row.original.openChatLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          오픈채팅 링크 열기
        </BlueLink>
      ) : (
        <div>오픈채팅방 링크 없음</div>
      ),
  }),
  busColumnHelper.display({
    id: 'actions',
    header: () => 'actions',
    cell: (info) => (
      <div>
        <BlueLink
          href={`/events/${info.row.original.eventId}/dates/${info.row.original.dailyEventId}/routes/${info.row.original.shuttleRouteId}/buses/${info.row.original.shuttleBusId}/edit`}
        >
          버스 수정하기
        </BlueLink>
      </div>
    ),
  }),
];

const routeHubColumnHelper =
  createColumnHelper<ShuttleRouteHubsInShuttleRoutesViewEntity>();

export const routeHubColumns = [
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
