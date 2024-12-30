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
import { useMemo } from 'react';
import { twJoin } from 'tailwind-merge';

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

  const filterCount = useMemo(() => {
    let count = 0;
    if (shuttleId !== undefined) count++;
    if (dailyShuttleId !== undefined) count++;
    if (shuttleRouteId !== undefined) count++;
    if (userNickname !== undefined) count++;
    if (passengerName !== undefined) count++;
    return count;
  }, [shuttleId, dailyShuttleId, shuttleRouteId, userNickname, passengerName]);

  return (
    <Disclosure>
      <DisclosureButton
        className={twJoin(
          'group flex w-fit items-center gap-2 justify-start gap-4 p-4 rounded-lg active:scale-90 hover:bg-grey-50 active:bg-grey-100 transition-all',
          filterCount === 0 ? '' : 'text-green-500',
        )}
      >
        <FilterIcon size={16} />
        {filterCount === 0 ? '필터' : `필터 (${filterCount}개 적용됨)`}
        <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel className="flex flex-col gap-4 bg-grey-50 rounded-xl p-8">
        <label>shuttleId</label>
        <Input
          value={optionalNumberOpt.encoder(shuttleId) ?? ''}
          setValue={(n) => setShuttleId(optionalNumberOpt.decoder(n))}
        />
        <label>dailyShuttleId</label>
        <Input
          value={optionalNumberOpt.encoder(dailyShuttleId) ?? ''}
          setValue={(n) => setDailyShuttleId(optionalNumberOpt.decoder(n))}
        />
        <label>shuttleRouteId</label>
        <Input
          value={optionalNumberOpt.encoder(shuttleRouteId) ?? ''}
          setValue={(n) => setShuttleRouteId(optionalNumberOpt.decoder(n))}
        />
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
