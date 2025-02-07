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
  regionId: string | undefined;
  value: string | null;
  setValue: (value: string | null) => void;
}

const RegionHubInput = ({ regionId, value, setValue }: Props) => {
  const [query, setQuery] = useState('');

  const { data, isLoading, error } = useGetRegionHubs({
    options: {
      regionId: validRegionID(regionId) ? regionId : '',
      page: undefined,
    },
    enabled: validRegionID(regionId),
  });

  const regionHubs = useMemo(
    () => data?.pages.flatMap((page) => page.regionHubs),
    [data],
  );

  const setSelectedHub = useCallback(
    (hub: RegionHub | null) => {
      setValue(hub?.regionHubId ?? null);
    },
    [setValue],
  );

  const selectedHub = useMemo(
    () => regionHubs?.find((hub) => hub.regionHubId === value) || null,
    [regionHubs, value],
  );

  const filtered: RegionHub[] = useMemo(() => {
    const filterByID =
      regionId === undefined
        ? regionHubs
        : regionHubs?.filter((h) => h.regionId === regionId);

    return query
      ? filterByFuzzy(filterByID ?? [], query, (p) => p.name)
      : (filterByID ?? []);
  }, [regionHubs, query, regionId]);

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
                : regionHubs?.length === 0
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
          {!isLoading && validRegionID(regionId) && (
            <Link
              href="/hubs/new"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-8 text-blue-500 hover:bg-blue-100"
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
  regionId: string | null;
  setRegionId: (value: string | null) => void;
  regionHubId: string | null;
  setRegionHubId: (value: string | null) => void;
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

const validRegionID = (regionId: string | undefined): regionId is string =>
  typeof regionId === 'string' && regionId !== '';
