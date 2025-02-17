'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon, RefreshCwIcon } from 'lucide-react';
import { Dispatch, ReactNode } from 'react';
import DebouncedInput from '@/components/input/DebouncedInput';
import { GetRegionHubsOptions } from '@/services/location.service';
import { RegionHubFilterAction } from '../hooks/useRegionHubFilter';
import RegionInput from '@/components/input/RegionInput';

interface Props {
  option: GetRegionHubsOptions;
  dispatch: Dispatch<RegionHubFilterAction>;
}

const RegionHubFilter = ({ option, dispatch }: Props) => {
  return (
    <Disclosure>
      <DisclosureButton className="group flex w-fit items-center justify-start gap-4 rounded-[8px] p-4 transition-all hover:bg-grey-50 active:scale-90 active:bg-grey-100">
        <FilterIcon size={16} />
        <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel className="mb-8 flex flex-col gap-8 rounded-[4px] bg-notion-green/50 p-16">
        <button
          type="button"
          onClick={() => dispatch({ type: 'RESET' })}
          className="flex items-center gap-4 text-14 font-500 text-grey-600"
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
        </section>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default RegionHubFilter;

const Label = ({ children }: { children: ReactNode }) => {
  return <label className="text-14 font-600 text-grey-900">{children}</label>;
};
