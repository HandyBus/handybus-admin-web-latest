'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon, RefreshCwIcon } from 'lucide-react';
import { Dispatch, ReactNode } from 'react';
import DebouncedInput from '@/components/input/DebouncedInput';
import { GetRegionHubsOptions } from '@/services/hub.service';
import { RegionHubFilterAction } from '../hooks/useRegionHubFilter';
import RegionInput from '@/components/input/RegionInput';
import Toggle from '@/components/button/Toggle';

interface Props {
  option: GetRegionHubsOptions;
  dispatch: Dispatch<RegionHubFilterAction>;
}

const RegionHubFilter = ({ option, dispatch }: Props) => {
  return (
    <Disclosure>
      <DisclosureButton className="group flex w-fit items-center justify-start gap-4 rounded-[8px] p-4 transition-all hover:bg-basic-grey-50 active:scale-90 active:bg-basic-grey-100">
        <FilterIcon size={16} />
        <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel className="bg-notion-green/50 mb-8 flex flex-col gap-8 rounded-[4px] p-16">
        <button
          type="button"
          onClick={() => dispatch({ type: 'RESET' })}
          className="flex items-center gap-4 text-14 font-500 text-basic-grey-600"
        >
          <RefreshCwIcon size={14} />
          필터 초기화
        </button>
        <section className="grid grid-cols-2 gap-12">
          <article>
            <Label>지역</Label>
            <RegionInput
              value={option.regionId ?? null}
              setValue={(value) =>
                dispatch({
                  type: 'SET_REGION_ID',
                  regionId: value || undefined,
                })
              }
            />
          </article>
          <article>
            <Label>장소 이름</Label>
            <DebouncedInput
              value={option.name ?? ''}
              setValue={(value) =>
                dispatch({
                  type: 'SET_NAME',
                  name: value || undefined,
                })
              }
            />
          </article>
          <article>
            <Label>태그</Label>
            <div className="flex flex-row gap-4">
              <Toggle
                label={'행사장'}
                value={option.usageType?.includes('EVENT_LOCATION') ?? false}
                setValue={() => {
                  const newUsageType = option.usageType?.includes(
                    'EVENT_LOCATION',
                  )
                    ? option.usageType?.filter(
                        (type) => type !== 'EVENT_LOCATION',
                      )
                    : [...(option.usageType ?? []), 'EVENT_LOCATION' as const];

                  dispatch({
                    type: 'SET_USAGE_TYPE',
                    usageType:
                      newUsageType.length > 0 ? newUsageType : undefined,
                  });
                }}
              />
              <Toggle
                label={'주차장'}
                value={option.usageType?.includes('EVENT_PARKING_LOT') ?? false}
                setValue={() => {
                  const newUsageType = option.usageType?.includes(
                    'EVENT_PARKING_LOT',
                  )
                    ? option.usageType?.filter(
                        (type) => type !== 'EVENT_PARKING_LOT',
                      )
                    : [
                        ...(option.usageType ?? []),
                        'EVENT_PARKING_LOT' as const,
                      ];

                  dispatch({
                    type: 'SET_USAGE_TYPE',
                    usageType:
                      newUsageType.length > 0 ? newUsageType : undefined,
                  });
                }}
              />
              <Toggle
                label={'정류장'}
                value={option.usageType?.includes('SHUTTLE_HUB') ?? false}
                setValue={() => {
                  const newUsageType = option.usageType?.includes('SHUTTLE_HUB')
                    ? option.usageType?.filter((type) => type !== 'SHUTTLE_HUB')
                    : [...(option.usageType ?? []), 'SHUTTLE_HUB' as const];

                  dispatch({
                    type: 'SET_USAGE_TYPE',
                    usageType:
                      newUsageType.length > 0 ? newUsageType : undefined,
                  });
                }}
              />
            </div>
          </article>
        </section>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default RegionHubFilter;

const Label = ({ children }: { children: ReactNode }) => {
  return (
    <label className="text-basic-grey-900 text-14 font-600">{children}</label>
  );
};
