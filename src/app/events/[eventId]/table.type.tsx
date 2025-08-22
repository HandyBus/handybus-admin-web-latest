'use client';

import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { formatDateString } from '@/utils/date.util';
import { EventsViewEntity } from '@/types/event.type';
import { DEFAULT_EVENT_IMAGE } from '@/constants/common';
import BlueLink from '@/components/link/BlueLink';
import BlueButton from '@/components/link/BlueButton';
import {
  sendDemandedShuttleRouteDoneCreating,
  sendDemandedShuttleRouteNotCreated,
} from '@/services/solapi.service';

const columnHelper = createColumnHelper<EventsViewEntity>();

export const columns = [
  columnHelper.display({
    id: 'action',
    header: '액션',
    cell: (props) => {
      const { eventId } = props.row.original;

      const handleSendShuttleRouteNotCreated = async () => {
        const isConfirmed = window.confirm(
          '노선 미개설 안내를 발송하시겠습니까?\n* 안내를 기존에 발송했는지 확인해주세요.\n* 수요조사에 참여한 모든 유저들에게 발송됩니다.',
        );
        if (!isConfirmed) {
          return;
        }
        try {
          await sendDemandedShuttleRouteNotCreated(eventId);
        } catch (error) {
          console.error(error);
          window.alert('발송에 실패했습니다.');
        }
      };

      const handleSendShuttleRouteDoneCreating = async () => {
        const isConfirmed = window.confirm(
          '노선 최종 개설 안내를 발송하시겠습니까?\n*안내를 기존에 발송했는지 확인해주세요.\n*수요조사에 참여하고 예약을 하지 않은 모든 유저들에게 발송됩니다.',
        );
        if (!isConfirmed) {
          return;
        }
        try {
          await sendDemandedShuttleRouteDoneCreating(eventId);
        } catch (error) {
          console.error(error);
          window.alert('발송에 실패했습니다.');
        }
      };

      return (
        <div className="flex flex-col gap-8">
          <BlueButton onClick={handleSendShuttleRouteNotCreated}>
            노선 미개설 안내 발송
          </BlueButton>
          <BlueButton onClick={handleSendShuttleRouteDoneCreating}>
            노선 최종 개설 안내 발송
          </BlueButton>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'image',
    header: '포스터',
    cell: (props) => (
      <div className="relative m-4 h-112 w-100">
        <Image
          src={props.row.original.eventImageUrl || DEFAULT_EVENT_IMAGE}
          alt="Event"
          fill
          className="object-contain"
        />
      </div>
    ),
  }),
  columnHelper.accessor('eventName', {
    header: '행사 정보',
    cell: (info) => {
      const { eventName, eventLocationName, eventType, eventArtists, eventId } =
        info.row.original;
      const artists = eventArtists
        ?.map((artist) => artist.artistName)
        .join(', ');
      return (
        <div className="flex flex-col p-8 text-16">
          <p className="font-700">{eventName}</p>
          <p className="font-400 text-basic-grey-700">{artists}</p>
          <p className="font-400 text-basic-grey-700">{eventType}</p>
          <p className="font-500 text-basic-grey-700">{eventLocationName}</p>
          <BlueLink href={`/events/${eventId}/edit`} className="text-12">
            수정하기
          </BlueLink>
        </div>
      );
    },
  }),
  columnHelper.accessor(
    (row) => row.dailyEvents.map((dailyEvent) => dailyEvent.date),
    {
      header: '날짜',
      cell: ({ getValue }) => {
        const dates: string[] = getValue();
        return (
          <div className="flex h-full flex-col justify-between">
            {dates.map((date, index) => (
              <p
                key={index}
                className="flex h-[58px] grow items-center justify-center whitespace-nowrap break-keep border-b border-basic-grey-100 px-8 last:border-b-0"
              >
                {formatDateString(date, 'date')}
              </p>
            ))}
          </div>
        );
      },
    },
  ),
  columnHelper.accessor('eventDetailImageUrl', {
    header: '상세 이미지',
    cell: (info) => {
      const { eventDetailImageUrl } = info.row.original;
      if (!eventDetailImageUrl) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className="relative w-400 p-4">
          <Image
            src={eventDetailImageUrl || DEFAULT_EVENT_IMAGE}
            alt="Event"
            width={400}
            height={0}
            className="h-auto w-full object-contain"
            style={{ height: 'auto' }}
          />
        </div>
      );
    },
  }),
];
