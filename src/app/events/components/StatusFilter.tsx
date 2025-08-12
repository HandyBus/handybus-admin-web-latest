'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { customTwMerge } from 'tailwind.config';
import Toggle from '@/components/button/Toggle';
import Stringifier from '@/utils/stringifier.util';
import { useSearchParams } from 'next/navigation';
import { EventStatusEnum } from '@/types/event.type';
import { EventStatus } from '@/types/event.type';

interface Props {
  eventStatus: EventStatus | undefined;
  setEventStatus: Dispatch<SetStateAction<EventStatus | undefined>>;
}

function Filter({ eventStatus, setEventStatus }: Props) {
  return (
    <Disclosure>
      <DisclosureButton
        className={customTwMerge(
          'gap-2 group flex w-fit items-center justify-start gap-4 rounded-8 p-4 transition-all hover:bg-basic-grey-50 active:scale-90 active:bg-basic-grey-100',
          eventStatus === undefined ? '' : 'text-green-500',
        )}
      >
        <FilterIcon size={16} />
        {eventStatus !== undefined
          ? `필터 (다음 조건이 일치: ${Stringifier.eventStatus(eventStatus)})`
          : `필터`}
        <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel className="flex flex-row gap-4 rounded-16 bg-basic-grey-50 p-8">
        {EventStatusEnum.options.map((status) => (
          <Toggle
            key={status}
            value={status === eventStatus}
            label={Stringifier.eventStatus(status)}
            onClick={() =>
              setEventStatus((s: EventStatus | undefined) =>
                s === status ? undefined : conform(status),
              )
            }
          />
        ))}
      </DisclosurePanel>
    </Disclosure>
  );
}

export default Filter;

export function useEventStatusOptions() {
  const sp = useSearchParams();
  const eventStatus = conform(sp.get('eventStatus'));
  return useState<EventStatus | undefined>(eventStatus);
}

const conform = (s: string | undefined | null) => {
  if (s === undefined || s === null) return undefined;
  switch (s) {
    case 'OPEN':
      return 'OPEN';
    case 'CLOSED':
      return 'CLOSED';
    case 'ENDED':
      return 'ENDED';
    case 'INACTIVE':
      return 'INACTIVE';
    default:
      return 'OPEN';
  }
};
