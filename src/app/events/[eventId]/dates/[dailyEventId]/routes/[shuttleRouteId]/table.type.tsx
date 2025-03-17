'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { formatDateString } from '@/utils/date.util';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';
import {
  AdminShuttleRoutesViewEntity,
  ShuttleRouteHubsInShuttleRoutesViewEntity,
} from '@/types/shuttleRoute.type';
import Stringifier from '@/utils/stringifier.util';

type ExtendedAdminShuttleRoutesViewEntity = AdminShuttleRoutesViewEntity & {
  totalSales: number;
  totalSalesWithDiscount: number;
};

const shuttleRouteColumnHelper =
  createColumnHelper<ExtendedAdminShuttleRoutesViewEntity>();

export const shuttleRouteColumns = [
  shuttleRouteColumnHelper.accessor('event.eventName', {
    header: () => '행사명',
    cell: (info) => info.getValue(),
  }),
  shuttleRouteColumnHelper.accessor('dailyEventId', {
    header: () => '날짜',
    cell: (info) => {
      const dailyEvents = info.row.original.event.dailyEvents;
      const dailyEvent = dailyEvents.find(
        (dailyEvent) => dailyEvent.dailyEventId === info.getValue(),
      );
      return dailyEvent ? formatDateString(dailyEvent.date, 'date') : '-';
    },
  }),
  shuttleRouteColumnHelper.accessor('name', {
    header: () => '노선 이름',
    cell: (info) => info.getValue(),
  }),
  shuttleRouteColumnHelper.accessor('reservationDeadline', {
    header: () => '예약 마감일',
    cell: (info) => formatDateString(info.getValue()),
  }),
  shuttleRouteColumnHelper.accessor('status', {
    header: () => '상태',
    cell: (info) => Stringifier.shuttleRouteStatus(info.getValue()),
  }),
  shuttleRouteColumnHelper.accessor('maxPassengerCount', {
    header: () => '최대 승객 수',
    cell: (info) => info.getValue(),
  }),
  shuttleRouteColumnHelper.accessor('regularPriceRoundTrip', {
    header: () => '왕복 가격',
    cell: (info) => info.getValue().toLocaleString(),
  }),
  shuttleRouteColumnHelper.accessor('regularPriceToDestination', {
    header: () => '가는 편 가격',
    cell: (info) => info.getValue().toLocaleString(),
  }),
  shuttleRouteColumnHelper.accessor('regularPriceFromDestination', {
    header: () => '오는 편 가격',
    cell: (info) => info.getValue().toLocaleString(),
  }),
  shuttleRouteColumnHelper.accessor('earlybirdDeadline', {
    header: () => '얼리버드 마감일',
    cell: (info) => {
      const value = info.getValue();
      return value ? formatDateString(value, 'datetime') : '-';
    },
  }),
  shuttleRouteColumnHelper.accessor('earlybirdPriceToDestination', {
    header: () => '얼리버드 가는 편 가격',
    cell: (info) => {
      const value = info.getValue();
      return value ? value.toLocaleString() : '-';
    },
  }),
  shuttleRouteColumnHelper.accessor('earlybirdPriceFromDestination', {
    header: () => '얼리버드 오는 편 가격',
    cell: (info) => {
      const value = info.getValue();
      return value ? value.toLocaleString() : '-';
    },
  }),
  shuttleRouteColumnHelper.accessor('totalSales', {
    header: () => '일반 매출',
    cell: (info) => {
      const value = info.getValue();
      return value ? value.toLocaleString() : '-';
    },
  }),
  shuttleRouteColumnHelper.accessor('totalSalesWithDiscount', {
    header: () => '실제 매출',
    cell: (info) => {
      const value = info.getValue();
      return value ? value.toLocaleString() : '-';
    },
  }),
];

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
