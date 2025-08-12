import { createColumnHelper } from '@tanstack/react-table';
import { formatDateString } from '@/utils/date.util';
import { ShuttleDemandsViewEntity } from '@/types/demand.type';
import Stringifier from '@/utils/stringifier.util';
import { ID_TO_REGION } from '@/constants/regions';
import dayjs from 'dayjs';

const columnHelper = createColumnHelper<ShuttleDemandsViewEntity>();

export const columns = [
  columnHelper.accessor('createdAt', {
    header: '수요조사 일시',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.display({
    id: 'shuttleRoute',
    header: () => '이용 노선',
    cell: (props) => {
      const event = props.row.original.event;
      const date = event?.dailyEvents.find(
        (dailyEvent) =>
          dailyEvent.dailyEventId === props.row.original.dailyEventId,
      )?.date;
      return (
        <p>
          <span className="text-16 font-500">{event?.eventName}</span>
          <br />
          <span className="text-14 font-400 text-basic-grey-600">
            {date && dayjs(date).tz('Asia/Seoul').format('YYYY.MM.DD')}
          </span>
        </p>
      );
    },
  }),
  columnHelper.accessor('type', {
    header: '유형',
    cell: (info) => Stringifier.tripType(info.getValue()),
  }),
  columnHelper.accessor('regionId', {
    header: '지역',
    cell: (info) => {
      const regionId = info.getValue();
      const region = ID_TO_REGION[regionId];
      return region ? region.bigRegion + ' ' + region.smallRegion : '기타';
    },
  }),
  columnHelper.display({
    id: 'toDestinationRegionHub',
    header: '회망 탑승지',
    cell: (props) => {
      const toDestinationRegionHub = props.row.original.toDestinationRegionHub;
      const desiredToDestinationRegionHub =
        props.row.original.desiredToDestinationRegionHub;
      const desiredExist = desiredToDestinationRegionHub !== null;
      return (
        <>
          {!desiredExist ? (
            <p>
              {toDestinationRegionHub?.name}
              <br />
              <span className="text-14 font-400 text-basic-grey-600">
                {toDestinationRegionHub?.address}
              </span>
            </p>
          ) : (
            <p>
              기타
              <br />
              <span className="text-14 font-400 text-basic-grey-600">
                {desiredToDestinationRegionHub}
              </span>
            </p>
          )}
        </>
      );
    },
  }),
  columnHelper.display({
    id: 'fromDestinationRegionHub',
    header: '회망 하차지',
    cell: (props) => {
      const fromDestinationRegionHub =
        props.row.original.fromDestinationRegionHub;
      const desiredFromDestinationRegionHub =
        props.row.original.desiredFromDestinationRegionHub;
      const desiredExist = desiredFromDestinationRegionHub !== null;
      return (
        <>
          {!desiredExist ? (
            <p>
              {fromDestinationRegionHub?.name}
              <br />
              <span className="text-14 font-400 text-basic-grey-600">
                {fromDestinationRegionHub?.address}
              </span>
            </p>
          ) : (
            <p>
              기타
              <br />
              <span className="text-14 font-400 text-basic-grey-600">
                {desiredFromDestinationRegionHub}
              </span>
            </p>
          )}
        </>
      );
    },
  }),
];
