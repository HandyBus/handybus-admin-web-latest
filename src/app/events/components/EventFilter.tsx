import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon } from 'lucide-react';
import Toggle from '@/components/button/Toggle';
import { Dispatch, ReactNode } from 'react';
import DebouncedInput from '@/components/input/DebouncedInput';
import { EventFilterAction, EventFilterOptions } from '../hooks/useEventFilter';
import { EventStatusEnum } from '@/types/event.type';
import Stringifier from '@/utils/stringifier.util';

interface Props {
  option: EventFilterOptions;
  dispatch: Dispatch<EventFilterAction>;
}

const EventFilter = ({ option, dispatch }: Props) => {
  return (
    <Disclosure>
      <DisclosureButton className="group flex w-fit items-center justify-start gap-4 rounded-[8px] p-4 transition-all hover:bg-basic-grey-50 active:scale-90 active:bg-basic-grey-100">
        <FilterIcon size={16} />
        <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel className="mb-8 flex flex-col gap-4 rounded-[4px] bg-brand-primary-400/50 p-16">
        <div className="grid grid-cols-2 gap-12">
          <article>
            <Label>행사 이름</Label>
            <DebouncedInput
              value={option.eventName ?? ''}
              setValue={(value) =>
                dispatch({
                  type: 'SET_EVENT_NAME',
                  eventName: value || undefined,
                })
              }
            />
          </article>
          <article>
            <Label>행사장</Label>
            <DebouncedInput
              value={option.eventLocationName ?? ''}
              setValue={(value) =>
                dispatch({
                  type: 'SET_EVENT_LOCATION_NAME',
                  eventLocationName: value || undefined,
                })
              }
            />
          </article>
          <article>
            <Label>행사장 주소</Label>
            <DebouncedInput
              value={option.eventLocationAddress ?? ''}
              setValue={(value) =>
                dispatch({
                  type: 'SET_EVENT_LOCATION_ADDRESS',
                  eventLocationAddress: value || undefined,
                })
              }
            />
          </article>
          <article>
            <Label>상태</Label>
            <div className="flex flex-row gap-4">
              <Toggle
                key="전체"
                label="전체"
                value={option.status === undefined}
                setValue={() =>
                  dispatch({
                    type: 'SET_STATUS',
                    status: undefined,
                  })
                }
              />
              {EventStatusEnum.options.map((status) => (
                <Toggle
                  key={Stringifier.eventStatus(status)}
                  label={Stringifier.eventStatus(status)}
                  value={option.status?.split(',').includes(status) ?? false}
                  setValue={() =>
                    dispatch({
                      type: 'SET_STATUS',
                      status,
                    })
                  }
                />
              ))}
            </div>
          </article>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default EventFilter;

const Label = ({ children }: { children: ReactNode }) => {
  return (
    <label className="text-14 font-600 text-basic-grey-700">{children}</label>
  );
};
