'use client';

import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import BlueLink from '@/components/link/BlueLink';
import RegionHubViewerModal from '@/components/viewer/RegionHubViewerModal';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';
import { EventsViewEntity } from '@/types/event.type';
import { DEFAULT_EVENT_IMAGE } from '@/constants/common';

const columnHelper = createColumnHelper<EventsViewEntity>();

export const columns = [
  columnHelper.accessor('eventId', {
    id: 'eventId',
    header: '행사 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'image',
    header: '포스터',
    cell: (props) => (
      <Image
        src={props.row.original.eventImageUrl || DEFAULT_EVENT_IMAGE}
        alt="Event"
        width={40}
        height={55}
        className="overflow-hidden"
      />
    ),
    size: 40,
    minSize: 40, //enforced during column resizing
    maxSize: 40, //enforced during column resizing
  }),
  columnHelper.accessor('eventName', {
    id: 'eventName',
    header: '행사 이름',
    cell: (info) => (
      <BlueLink href={`/events/${info.row.original.eventId}`}>
        {info.getValue()}
      </BlueLink>
    ),
  }),
  columnHelper.accessor('eventType', {
    id: 'eventType',
    header: '행사 종류',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('eventStatus', {
    id: 'eventStatus',
    header: '행사 상태',
    cell: (info) => Stringifier.eventStatus(info.getValue()),
  }),
  columnHelper.group({
    id: 'region',
    header: '목적지',
    columns: [
      columnHelper.accessor('regionId', {
        id: 'regionId',
        header: '지역 ID',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('regionHubId', {
        id: 'regionHubId',
        header: '거점지 ID',
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: 'regionHub',
        header: '거점지 종합 정보',
        cell: (info) => (
          <RegionHubViewerModal
            regionId={info.row.original.regionId}
            regionHubId={info.row.original.regionHubId}
          />
        ),
      }),
    ],
  }),
  // Accessor Column
  columnHelper.group({
    id: 'eventLocation',
    header: '행사 장소',
    columns: [
      columnHelper.accessor('eventLocationName', {
        id: 'eventLocationName',
        header: '행사 장소 이름',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('eventLocationAddress', {
        id: 'eventLocationAddress',
        header: '행사 장소 주소',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('eventLocationLatitude', {
        header: '행사 장소 위도',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('eventLocationLongitude', {
        header: '행사 장소 경도',
        cell: (info) => info.getValue(),
      }),
    ],
  }),
  columnHelper.accessor((row) => row.dailyEvents.map((de) => de.date), {
    header: '날짜',
    cell: ({ getValue }) => {
      const dates: string[] = getValue();
      return (
        <div>
          {dates.map((date, index) => (
            <div key={index}>{formatDateString(date, 'date')}</div>
          ))}
        </div>
      );
    },
  }),
  // TODO remove option chaining '?' after fixing the api
  columnHelper.accessor((row) => row.eventArtists?.map((p) => p.artistName), {
    id: 'artists',
    header: '출연자',
    cell: (info) => {
      const ps: string[] = info.getValue() || [];
      return (
        <div>
          {ps.map((p) => (
            <div key={p}>{p}</div>
          ))}
        </div>
      );
    },
  }),
  // columnHelper.display({
  //   id: 'actions',
  //   header: '액션',
  //   cell: (props) => (
  //     <BlueLink href={`/events/${props.row.original.eventId}`}>
  //       자세히 보기
  //     </BlueLink>
  //   ),
  // }),
];

// Initial column visibility - columns are shown by default
export const initialColumnVisibility = {
  eventId: false,
  eventLocationAddress: false,
  eventLocationLatitude: false,
  eventLocationLongitude: false,
  eventCoord: false,
  regionId: false,
  regionHubId: false,
};
