'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { formatDateString } from '@/utils/date.util';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';
import { ShuttleRouteHubsInShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import Stringifier from '@/utils/stringifier.util';

type ExtendedShuttleBusesViewEntity = ShuttleBusesViewEntity & {
  eventId: string;
  dailyEventId: string;
  shuttleRouteId: string;
  handyPhoneNumber?: string;
  handyNickname?: string;
};

const busColumnHelper = createColumnHelper<ExtendedShuttleBusesViewEntity>();

export const busColumns = [
  busColumnHelper.accessor('busType', {
    header: () => '버스 종류',
    cell: (info) => Stringifier.busType(info.getValue()),
  }),
  busColumnHelper.accessor('busName', {
    header: () => '호차',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('busDriverPhoneNumber', {
    header: () => '기사님 전화번호',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('handyNickname', {
    header: () => '핸디 닉네임',
    cell: (info) => info.getValue() ?? '-',
  }),
  busColumnHelper.accessor('handyPhoneNumber', {
    header: () => '핸디 전화번호',
    cell: (info) => info.getValue() ?? '-',
  }),
  busColumnHelper.display({
    id: 'openChatLink',
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
        <div>-</div>
      ),
  }),
  busColumnHelper.display({
    id: 'edit-bus',
    header: () => '수정하기',
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
