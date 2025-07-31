'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon, FilterXIcon } from 'lucide-react';
import { Dispatch, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import EventInput from '@/components/input/EventInput';
import DailyEventInput from '@/components/input/DailyEventInput';
import { useQuery } from '@tanstack/react-query';
import ShuttleRouteInput from '@/components/input/ShuttleRouteInput';
import { ReservationFilterAction } from '../hooks/userReservationFilter';
import Toggle from '@/components/button/Toggle';
import Stringifier from '@/utils/stringifier.util';
import ShuttleBusInput from '@/components/input/ShuttleBusInput';
import { GetReservationsOptions } from '@/services/reservation.service';
import { getShuttleRoute } from '@/services/shuttleRoute.service';
import {
  CancelStatusEnum,
  HandyStatusEnum,
  ReservationStatusEnum,
} from '@/types/reservation.type';
import DebouncedInput from '@/components/input/DebouncedInput';
import { getEvent } from '@/services/event.service';

interface Props {
  option: GetReservationsOptions;
  dispatch: Dispatch<ReservationFilterAction>;
}

function ReservationFilter({ option, dispatch }: Props) {
  const filterCount = useMemo(() => {
    return Object.values(option).filter((v) => v !== undefined).length;
  }, [option]);

  const { data: validity } = useQuery({
    queryKey: [
      'reservationFilterCheckValidity',
      option.eventId,
      option.dailyEventId,
      option.shuttleRouteId,
    ],
    queryFn: async () => await checkValidity(option),
  });

  return (
    <Disclosure>
      <DisclosureButton
        className={twMerge(
          'gap-2 group flex w-fit items-center justify-start gap-4 rounded-lg p-4 transition-all hover:bg-grey-50 active:scale-90 active:bg-grey-100',
          filterCount === 0 ? '' : 'text-green-500',
          validity === false ? 'text-red-500' : '',
        )}
      >
        <FilterIcon size={16} />
        {filterCount === 0 ? '필터' : `필터 (${filterCount}개 적용됨)`}
        {validity === false && ' - 오류'}
        <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      {filterCount > 0 && (
        <button
          className="gap-2 group flex w-fit flex-row items-center justify-start gap-4 rounded-lg p-4 transition-all hover:bg-grey-50 active:scale-90 active:bg-grey-100"
          onClick={() => {
            dispatch({ type: 'RESET' });
          }}
        >
          <FilterXIcon size={14} />
          <span>필터 초기화</span>
        </button>
      )}
      <DisclosurePanel className="flex flex-col gap-4 rounded-xl bg-grey-50 p-8">
        <label>셔틀</label>
        <EventInput
          value={option.eventId ?? null}
          setValue={(n) =>
            dispatch({ type: 'SET_EVENT_ID', eventId: n ?? undefined })
          }
        />
        {option.eventId && (
          <>
            <label>일일 셔틀</label>
            <DailyEventInput
              eventId={option.eventId}
              value={option.dailyEventId ?? null}
              setValue={(n) =>
                dispatch({
                  type: 'SET_DAILY_EVENT_ID',
                  dailyEventId: n ?? undefined,
                })
              }
            />
          </>
        )}
        {option.eventId && option.dailyEventId && (
          <>
            <label>노선</label>
            <ShuttleRouteInput
              eventId={option.eventId}
              dailyEventId={option.dailyEventId}
              value={option.shuttleRouteId ?? null}
              setValue={(n) =>
                dispatch({
                  type: 'SET_SHUTTLE_ROUTE_ID',
                  shuttleRouteId: n ?? undefined,
                })
              }
            />
          </>
        )}
        {option.eventId && option.dailyEventId && option.shuttleRouteId && (
          <>
            <label>버스</label>
            <ShuttleBusInput
              eventId={option.eventId}
              dailyEventId={option.dailyEventId}
              shuttleRouteId={option.shuttleRouteId}
              value={option.shuttleBusId ?? null}
              setValue={(n) =>
                dispatch({
                  type: 'SET_SHUTTLE_BUS_ID',
                  shuttleBusId: n ?? undefined,
                })
              }
            />
          </>
        )}
        <label>유저 이름 (fuzzy)</label>
        <DebouncedInput
          value={option.userName ?? ''}
          setValue={(n) =>
            dispatch({ type: 'SET_USER_NAME', userName: n || undefined })
          }
        />
        <label>유저 닉네임 (fuzzy)</label>
        <DebouncedInput
          value={option.userNickname ?? ''}
          setValue={(n) =>
            dispatch({
              type: 'SET_USER_NICKNAME',
              userNickname: n || undefined,
            })
          }
        />
        <label>
          (구) 탑승자 이름 (fuzzy) (옛날 예약에서 탑승객 이름 받을떄 사용)
        </label>
        <DebouncedInput
          value={option.passengerName ?? ''}
          setValue={(n) =>
            dispatch({
              type: 'SET_PASSENGER_NAME',
              passengerName: n || undefined,
            })
          }
        />
        <label>핸디 상태</label>
        <div className="flex flex-row gap-4">
          {HandyStatusEnum.options.map((handyStatus) => (
            <Toggle
              key={handyStatus}
              label={Stringifier.handyStatus(handyStatus)}
              value={option.handyStatus === handyStatus}
              setValue={() =>
                dispatch({
                  type: 'SET_HANDY_STATUS',
                  handyStatus:
                    handyStatus === option.handyStatus
                      ? undefined
                      : handyStatus,
                })
              }
            />
          ))}
        </div>
        <label>예약 상태</label>
        <div className="flex flex-row gap-4">
          {ReservationStatusEnum.options.map((reservationStatus) => (
            <Toggle
              key={reservationStatus}
              label={Stringifier.reservationStatus(reservationStatus)}
              value={option.reservationStatus === reservationStatus}
              setValue={() =>
                dispatch({
                  type: 'SET_RESERVATION_STATUS',
                  reservationStatus:
                    reservationStatus === option.reservationStatus
                      ? undefined
                      : reservationStatus,
                })
              }
            />
          ))}
        </div>
        <label>취소 상태</label>
        <div className="flex flex-row gap-4">
          {CancelStatusEnum.options.map((cancelStatus) => (
            <Toggle
              key={cancelStatus}
              label={Stringifier.cancelStatus(cancelStatus)}
              value={option.cancelStatus === cancelStatus}
              setValue={() =>
                dispatch({
                  type: 'SET_CANCEL_STATUS',
                  cancelStatus:
                    cancelStatus === option.cancelStatus
                      ? undefined
                      : cancelStatus,
                })
              }
            />
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

export default ReservationFilter;

const checkValidity = async ({
  eventId,
  dailyEventId,
  shuttleRouteId,
}: GetReservationsOptions) => {
  try {
    if (
      shuttleRouteId !== undefined &&
      (eventId === undefined || dailyEventId === undefined)
    ) {
      return false;
    }

    if (dailyEventId !== undefined && eventId === undefined) {
      return false;
    }

    if (eventId === undefined) {
      return true;
    }

    const event = await getEvent(eventId);

    if (dailyEventId === undefined) {
      return true;
    }

    if (event.dailyEvents.every((d) => d.dailyEventId !== dailyEventId)) {
      return false;
    }

    if (shuttleRouteId === undefined) {
      return true;
    }

    await getShuttleRoute(eventId, dailyEventId, shuttleRouteId);

    return true;
  } catch {
    return false;
  }
};
