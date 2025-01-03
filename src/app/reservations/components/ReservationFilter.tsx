'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon } from 'lucide-react';
import useParamState, {
  optionalNumberOpt,
  optionalStringOpt,
} from '@/hooks/useParamState';
import Input from '@/components/input/Input';
import { useEffect, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import ShuttleInput from '@/components/input/ShuttleInput';
import DailyShuttleInput from '@/components/input/DailyShuttleInput';
import { useQuery } from '@tanstack/react-query';
import { getShuttle } from '@/services/api/shuttle.services';
import { getRoute } from '@/services/api/route.services';
import ShuttleRouteInput from '@/components/input/ShuttleRouteInput';
import usePrevious, { isFirst } from '@/hooks/usePrevious';

function Filter() {
  const [shuttleId, setShuttleId] = useParamState<number | undefined>(
    undefined,
    'shuttleId',
    optionalNumberOpt,
  );
  const [dailyShuttleId, setDailyShuttleId] = useParamState(
    undefined,
    'dailyShuttleId',
    optionalNumberOpt,
  );
  const [shuttleRouteId, setShuttleRouteId] = useParamState(
    undefined,
    'shuttleRouteId',
    optionalNumberOpt,
  );
  const [userNickname, setUserNickname] = useParamState(
    undefined,
    'userNickname',
    optionalStringOpt,
  );
  const [passengerName, setPassengerName] = useParamState(
    undefined,
    'passengerName',
    optionalStringOpt,
  );

  const prevShuttleId = usePrevious(shuttleId);
  const prevDailyShuttleId = usePrevious(dailyShuttleId);

  useEffect(() => {
    if (!isFirst(prevDailyShuttleId) && prevShuttleId !== shuttleId) {
      setDailyShuttleId(undefined);
      setShuttleRouteId(undefined);
    }
  }, [shuttleId]);

  useEffect(() => {
    if (!isFirst(prevDailyShuttleId) && prevDailyShuttleId !== dailyShuttleId) {
      setShuttleRouteId(undefined);
    }
  }, [dailyShuttleId]);

  const filterCount = useMemo(() => {
    let count = 0;
    if (shuttleId !== undefined) count++;
    if (dailyShuttleId !== undefined) count++;
    if (shuttleRouteId !== undefined) count++;
    if (userNickname !== undefined) count++;
    if (passengerName !== undefined) count++;
    return count;
  }, [shuttleId, dailyShuttleId, shuttleRouteId, userNickname, passengerName]);

  const { data: validity } = useQuery({
    queryKey: [
      'reservationFilterCheckValidity',
      shuttleId,
      dailyShuttleId,
      shuttleRouteId,
    ],
    queryFn: async () =>
      await checkValidity(shuttleId, dailyShuttleId, shuttleRouteId),
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
      <DisclosurePanel className="flex flex-col gap-4 bg-grey-50 rounded-xl p-8">
        <label>shuttleId</label>
        <ShuttleInput
          value={shuttleId ?? null}
          setValue={(n) => setShuttleId(n ?? undefined)}
        />
        {shuttleId && (
          <>
            <label>dailyShuttleId</label>
            <DailyShuttleInput
              shuttleId={shuttleId}
              value={dailyShuttleId ?? null}
              setValue={(n) => setDailyShuttleId(n ?? undefined)}
            />
          </>
        )}
        {shuttleId && dailyShuttleId && (
          <>
            <label>shuttleRouteId</label>
            <ShuttleRouteInput
              shuttleId={shuttleId}
              dailyShuttleId={dailyShuttleId}
              value={shuttleRouteId ?? null}
              setValue={(n) => setShuttleRouteId(n ?? undefined)}
            />
          </>
        )}
        <label>userNickname (fuzzy)</label>
        <Input
          value={optionalStringOpt.encoder(userNickname) ?? ''}
          setValue={(n) => setUserNickname(optionalStringOpt.decoder(n))}
        />
        <label>passengerName (fuzzy)</label>
        <Input
          value={optionalStringOpt.encoder(passengerName) ?? ''}
          setValue={(n) => setPassengerName(optionalStringOpt.decoder(n))}
        />
      </DisclosurePanel>
    </Disclosure>
  );
}

export default Filter;

const checkValidity = async (
  shuttleId: number | undefined,
  dailyShuttleId: number | undefined,
  shuttleRouteId: number | undefined,
) => {
  try {
    if (
      shuttleRouteId !== undefined &&
      (shuttleId === undefined || dailyShuttleId === undefined)
    ) {
      return false;
    }

    if (dailyShuttleId !== undefined && shuttleId === undefined) {
      return false;
    }

    if (shuttleId === undefined) {
      return true;
    }

    const shuttle = await getShuttle(shuttleId);

    if (dailyShuttleId === undefined) {
      return true;
    }

    if (
      shuttle.dailyShuttles.every((d) => d.dailyShuttleId !== dailyShuttleId)
    ) {
      return false;
    }

    if (shuttleRouteId === undefined) {
      return true;
    }

    await getRoute(shuttleId, dailyShuttleId, shuttleRouteId);

    return true;
  } catch {
    return false;
  }
};
