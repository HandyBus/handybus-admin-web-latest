'use client';

import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from '@headlessui/react';
import { filterByFuzzy } from '@/utils/fuzzy.util';
import { getHubs } from '@/services/v1/hub.services';
import { RegionHub } from '@/types/v1/regionHub.type';

interface Props {
  regionId: number | undefined;
  value: number | null;
  setValue: (value: number | null) => void;
}

import { ChevronDown } from 'lucide-react';
import RegionInput from './RegionInput';
import Link from 'next/link';

const validRegionID = (regionId: number | undefined): regionId is number =>
  typeof regionId === 'number' && !Number.isNaN(regionId);

const RegionHubInput = ({ regionId, value, setValue }: Props) => {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['hub', regionId],
    queryFn: async () =>
      validRegionID(regionId) ? await getHubs(regionId) : [],
  });

  const setSelectedHub = useCallback(
    (hub: RegionHub | null) => {
      setValue(hub?.regionHubId ?? null);
    },
    [setValue],
  );

  const selectedHub = useMemo(
    () => data?.find((hub) => hub.regionHubId === value) || null,
    [data, value],
  );

  const filtered: RegionHub[] = useMemo(() => {
    const filterByID =
      regionId === undefined
        ? data
        : data?.filter((h) => h.regionId === regionId);

    return query
      ? filterByFuzzy(filterByID ?? [], query, (p) => p.name)
      : (filterByID ?? []);
  }, [data, query, regionId]);

  if (error) return <div>Failed to load hubs</div>;

  return (
    <Combobox
      immediate
      value={selectedHub}
      onChange={setSelectedHub}
      onClose={() => setQuery('')}
    >
      <div className="relative group">
        <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
          <ChevronDown />
        </ComboboxButton>
        <ComboboxInput
          className="p-8 size-full border border-grey-200 rounded-lg focus:outline-blue-400"
          aria-label="Assignee"
          placeholder={
            !validRegionID(regionId)
              ? '유효한 지역을 선택해야합니다.'
              : isLoading
                ? '로딩 중…'
                : data?.length === 0
                  ? '거점지가 없습니다'
                  : '거점지 선택'
          }
          defaultValue={null}
          displayValue={(hub: null | RegionHub) => hub?.name ?? ''}
          onChange={(event) => setQuery(event.target.value)}
        />

        <ComboboxOptions
          anchor="bottom"
          className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
        >
          {filtered.map((hub) => (
            <ComboboxOption
              key={hub.regionHubId}
              value={hub}
              className="data-[focus]:bg-blue-100 p-8"
            >
              {hub.name}
            </ComboboxOption>
          ))}
          {data?.length === 0 && !isLoading && validRegionID(regionId) && (
            <Link
              href="/hubs/new"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-8 text-blue-500 hover:bg-blue-50"
            >
              + 새로운 거점 만들기
            </Link>
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default RegionHubInput;

/**
 *
 */
export const RegionHubInputSelfContained = ({
  value,
  setValue,
}: Omit<Props, 'regionId'>) => {
  const [regionId, setRegionId] = useState<number | null>(null);
  return (
    <div className="flex flex-col">
      <RegionInput value={regionId} setValue={setRegionId} />
      <RegionHubInput
        regionId={regionId ?? undefined}
        value={value}
        setValue={setValue}
      />
    </div>
  );
};
