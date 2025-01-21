'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { EventsView, EventsViewEntity } from '@/types/v2/event.type';
import Toggle from '@/components/button/Toggle';
import Stringifier from '@/utils/stringifier.util';
import { useSearchParams } from 'next/navigation';

interface Props {
  eventStatus: EventsView['eventStatus'] | undefined;
  setEventStatus: Dispatch<
    SetStateAction<EventsView['eventStatus'] | undefined>
  >;
}

function Filter({ eventStatus, setEventStatus }: Props) {
  return (
    <Disclosure>
      <DisclosureButton
        className={twMerge(
          'group flex w-fit items-center gap-2 justify-start gap-4 p-4 rounded-lg active:scale-90 hover:bg-grey-50 active:bg-grey-100 transition-all',
          eventStatus === undefined ? '' : 'text-green-500',
        )}
      >
        <FilterIcon size={16} />
        {eventStatus !== undefined
          ? `필터 (다음 조건이 일치: ${Stringifier.eventStatus(eventStatus)})`
          : `필터`}
        <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel className="flex flex-row gap-4 bg-grey-50 rounded-xl p-8">
        {EventsViewEntity.shape.eventStatus.options.map((status) => (
          <Toggle
            key={status}
            value={status === eventStatus}
            label={Stringifier.eventStatus(status)}
            onClick={() =>
              setEventStatus((s: EventsView['eventStatus'] | undefined) =>
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
  return useState<EventsView['eventStatus'] | undefined>(eventStatus);
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
