'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon } from 'lucide-react';
import useParamState, { ParamStateOptions } from '@/hooks/useParamState';
import { twMerge } from 'tailwind-merge';
import Toggle from '@/components/button/Toggle';
import Stringifier from '@/utils/stringifier.util';
import { EventStatus, EventStatusEnum } from '@/types/event.type';

export function useEventStatusOptions() {
  return useParamState<EventStatus | undefined>(
    'OPEN',
    'status',
    encodeEventStatusOptions,
  );
}

function Filter() {
  const [eventStatus, setEventStatus] = useEventStatusOptions();

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
        {EventStatusEnum.options.map((status) => (
          <Toggle
            key={status}
            value={status === eventStatus}
            label={Stringifier.eventStatus(status)}
            onClick={() =>
              setEventStatus((s) => (s === status ? undefined : status))
            }
          />
        ))}
      </DisclosurePanel>
    </Disclosure>
  );
}

export default Filter;

const encodeEventStatusOptions: ParamStateOptions<EventStatus | undefined> = {
  // null (전체 필터)를 'ALL'로 인코딩
  encoder: (s) => (s === undefined ? 'ALL' : s),
  decoder: (s: string | null) => {
    if (s === 'ALL') {
      return undefined;
    } else if (EventStatusEnum.options.includes(s as EventStatus)) {
      return s as EventStatus;
    } else {
      // s === null 은 전체 필터를 의미하지 않음 - 빈 필터를 의미함. 기본 필터를 OPEN으로 설정
      return 'OPEN';
    }
  },
};
