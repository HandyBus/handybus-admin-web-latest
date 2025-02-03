'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from '@headlessui/react';
import { filterByFuzzy } from '@/utils/fuzzy.util';
import { RegionHub } from '@/types/hub.type';
import { ChevronDown } from 'lucide-react';
import RegionInput from './RegionInput';
import { useGetRegionHubs } from '@/services/location.service';
import Link from 'next/link';

interface Props {
  regionId: number | undefined;
  value: number | null;
  setValue: (value: number | null) => void;
}

const RegionHubInput = ({ regionId, value, setValue }: Props) => {
  const [query, setQuery] = useState('');

  const { data, isLoading, error } = useGetRegionHubs(
    validRegionID(regionId) ? regionId : 0,
  );

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
      <div className="group relative">
        <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
          <ChevronDown />
        </ComboboxButton>
        <ComboboxInput
          className="size-full rounded-lg border border-grey-200 p-8 focus:outline-blue-400"
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
          autoComplete="off"
        />

        <ComboboxOptions
          anchor="bottom"
          className="mt-4 w-[var(--input-width)] rounded-lg bg-white shadow-md empty:invisible"
        >
          {filtered.map((hub) => (
            <ComboboxOption
              key={hub.regionHubId}
              value={hub}
              className="p-8 data-[focus]:bg-blue-100"
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

export const RegionHubInputSelfContained = ({
  regionId,
  setRegionId,
  regionHubId,
  setRegionHubId,
}: {
  regionId: number | null;
  setRegionId: (value: number | null) => void;
  regionHubId: number | null;
  setRegionHubId: (value: number | null) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <RegionInput value={regionId} setValue={setRegionId} />
      <RegionHubInput
        regionId={regionId ?? undefined}
        value={regionHubId}
        setValue={setRegionHubId}
      />
    </div>
  );
};

const validRegionID = (regionId: number | undefined): regionId is number =>
  typeof regionId === 'number' && !Number.isNaN(regionId);
