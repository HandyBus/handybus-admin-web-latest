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
import { RegionHubsViewEntity } from '@/types/hub.type';
import { ChevronDown } from 'lucide-react';
import RegionInput from './RegionInput';
import { useGetRegionHubs } from '@/services/hub.service';
import Link from 'next/link';

/**
 * @hubType SHUTTLE_HUB: 정류장 / EVENT_LOCATION: 행사장 / DESTINATION: 행사장 + 정류장을 보여줍니다.
 */

interface Props {
  hubType: 'SHUTTLE_HUB' | 'EVENT_LOCATION' | 'DESTINATION';
  regionId: string | undefined;
  value: string | null;
  setValue: (
    value: string | null,
    latitude: number | null,
    longitude: number | null,
  ) => void;
}

const RegionHubInput = ({ hubType, regionId, value, setValue }: Props) => {
  const [query, setQuery] = useState('');

  const { data, isLoading, error } = useGetRegionHubs({
    options: {
      regionId: validRegionID(regionId) ? regionId : '',
      page: undefined,
    },
    enabled: validRegionID(regionId),
  });

  const regionHubs = useMemo(
    () =>
      data?.pages.flatMap((page) =>
        page.regionHubs.filter((hub) => {
          if (!hubType) return true;
          if (hubType === 'SHUTTLE_HUB') return hub.shuttleHub;
          if (hubType === 'EVENT_LOCATION') return hub.eventLocation;
          if (hubType === 'DESTINATION')
            return hub.eventLocation || hub.eventParkingLot;
        }),
      ),
    [data],
  );

  const setSelectedHub = useCallback(
    (hub: RegionHubsViewEntity | null) => {
      setValue(
        hub?.regionHubId ?? null,
        hub?.latitude ?? null,
        hub?.longitude ?? null,
      );
    },
    [setValue],
  );

  const selectedHub = useMemo(
    () => regionHubs?.find((hub) => hub.regionHubId === value) || null,
    [regionHubs, value],
  );

  const filtered: RegionHubsViewEntity[] = useMemo(() => {
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
                  ? '장소가 없습니다'
                  : '장소 선택'
          }
          defaultValue={null}
          displayValue={(hub: null | RegionHubsViewEntity) => hub?.name ?? ''}
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
              href="/locations/new"
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
  hubType,
  regionId,
  setRegionId,
  regionHubId,
  setRegionHubId,
}: {
  hubType: 'SHUTTLE_HUB' | 'EVENT_LOCATION' | 'DESTINATION';
  regionId: string | null;
  setRegionId: (value: string | null) => void;
  regionHubId: string | null;
  setRegionHubId: (
    value: string | null,
    latitude: number | null,
    longitude: number | null,
  ) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <RegionInput value={regionId} setValue={setRegionId} />
      <RegionHubInput
        hubType={hubType}
        regionId={regionId ?? undefined}
        value={regionHubId}
        setValue={setRegionHubId}
      />
    </div>
  );
};

const validRegionID = (regionId: string | undefined): regionId is string =>
  typeof regionId === 'string' && regionId !== '';
