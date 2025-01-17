'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon, FilterXIcon } from 'lucide-react';
import Input from '@/components/input/Input';
import { Dispatch, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import EventInput from '@/components/input/EventInput';
import DailyEventInput from '@/components/input/DailyEventInput';
import { useQuery } from '@tanstack/react-query';
import { getEvent } from '@/services/v2/event.services';
import { getRoute } from '@/services/v2/shuttleRoute.services';
import ShuttleRouteInput from '@/components/input/ShuttleRouteInput';
import { GetReservationOption } from '@/services/v2/reservations.services';
import { ReservationFilterAction } from '../hooks/userReservationFilter';
import { ReservationViewEntity } from '@/types/v2/reservation.type';
import Toggle from '@/components/button/Toggle';
import Stringifier from '@/utils/stringifier.util';
import ShuttleBusInput from '@/components/input/ShuttleBusInput';

interface Props {
  option: GetReservationOption;
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
          'group flex w-fit items-center gap-2 justify-start gap-4 p-4 rounded-lg active:scale-90 hover:bg-grey-50 active:bg-grey-100 transition-all',
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
          className="group items-center gap-2 justify-start gap-4 p-4 rounded-lg active:scale-90 hover:bg-grey-50 active:bg-grey-100 transition-all flex flex-row w-fit"
          onClick={() => {
            dispatch({ type: 'RESET' });
          }}
        >
          <FilterXIcon size={14} />
          <span>필터 초기화</span>
        </button>
      )}
      <DisclosurePanel className="flex flex-col gap-4 bg-grey-50 rounded-xl p-8">
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
        <label>유저 닉네임 (fuzzy)</label>
        <Input
          value={option.userNickname ?? ''}
          setValue={(n) =>
            dispatch({
              type: 'SET_USER_NICKNAME',
              userNickname: n || undefined,
            })
          }
        />
        <label>탑승자 이름 (fuzzy)</label>
        <Input
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
          {ReservationViewEntity.shape.handyStatus.options.map(
            (handyStatus) => (
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
            ),
          )}
        </div>
        <label>예약 상태</label>
        <div className="flex flex-row gap-4">
          {ReservationViewEntity.shape.reservationStatus.options.map(
            (reservationStatus) => (
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
            ),
          )}
        </div>
        <label>취소 상태</label>
        <div className="flex flex-row gap-4">
          {ReservationViewEntity.shape.cancelStatus.options.map(
            (cancelStatus) => (
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
            ),
          )}
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
}: GetReservationOption) => {
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

    const shuttle = await getEvent(eventId);

    if (dailyEventId === undefined) {
      return true;
    }

    if (shuttle.dailyEvents.every((d) => d.dailyEventId !== dailyEventId)) {
      return false;
    }

    if (shuttleRouteId === undefined) {
      return true;
    }

    await getRoute(eventId, dailyEventId, shuttleRouteId);

    return true;
  } catch {
    return false;
  }
};
