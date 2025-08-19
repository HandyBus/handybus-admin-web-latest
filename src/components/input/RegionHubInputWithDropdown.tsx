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
import { HubUsageType, RegionHubsViewEntity } from '@/types/hub.type';
import { ChevronDown } from 'lucide-react';
import RegionInput from './RegionInput';
import { useGetRegionHubs } from '@/services/hub.service';
import Link from 'next/link';

interface Props {
  hubType: HubUsageType;
  regionId: string | null;
  setRegionId: (value: string | null) => void;
  regionHubId: string | null;
  setRegionHubId: ({
    regionHubId,
    latitude,
    longitude,
  }: {
    regionHubId: string | null;
    latitude: number | null;
    longitude: number | null;
  }) => void;
  disabled?: boolean;
}

const RegionHubInputWithDropdown = ({
  hubType,
  regionId,
  setRegionId,
  regionHubId,
  setRegionHubId,
  disabled,
}: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <RegionInput
        value={regionId}
        setValue={setRegionId}
        disabled={disabled}
      />
      <RegionHubInput
        hubType={hubType}
        regionId={regionId ?? undefined}
        value={regionHubId}
        setValue={setRegionHubId}
        disabled={disabled}
      />
    </div>
  );
};

export default RegionHubInputWithDropdown;

interface RegionHubInputProps {
  hubType: HubUsageType;
  regionId: string | undefined;
  value: string | null;
  setValue: ({
    regionHubId,
    latitude,
    longitude,
  }: {
    regionHubId: string | null;
    latitude: number | null;
    longitude: number | null;
  }) => void;
  disabled?: boolean;
}

const RegionHubInput = ({
  hubType,
  regionId,
  value,
  setValue,
  disabled,
}: RegionHubInputProps) => {
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
          switch (hubType) {
            case 'SHUTTLE_HUB':
              return hub.shuttleHub;
            case 'EVENT_LOCATION':
              return hub.eventLocation;
            case 'EVENT_PARKING_LOT':
              return hub.eventParkingLot;
            case 'HANDY_PARTY':
              return hub.handyParty;
            default:
              return true;
          }
        }),
      ),
    [data],
  );

  const setSelectedHub = useCallback(
    (hub: RegionHubsViewEntity | null) => {
      setValue({
        regionHubId: hub?.regionHubId ?? null,
        latitude: hub?.latitude ?? null,
        longitude: hub?.longitude ?? null,
      });
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
      disabled={disabled}
    >
      <div className="group relative">
        <ComboboxButton
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-basic-grey-400 group-focus:text-basic-blue-400"
        >
          <ChevronDown />
        </ComboboxButton>
        <ComboboxInput
          className="size-full rounded-8 border border-basic-grey-200 p-8 focus:outline-basic-blue-400"
          aria-label="Assignee"
          placeholder={
            !validRegionID(regionId)
              ? '장소'
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
          className="mt-4 w-[var(--input-width)] rounded-8 bg-basic-white shadow-md empty:invisible"
        >
          {filtered.map((hub) => (
            <ComboboxOption
              key={hub.regionHubId}
              value={hub}
              className="p-8 data-[focus]:bg-basic-blue-100"
            >
              {hub.name}
            </ComboboxOption>
          ))}
          {!isLoading && validRegionID(regionId) && (
            <Link
              href="/locations/new"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-8 text-basic-blue-400 hover:bg-basic-blue-100"
            >
              + 새로운 거점 만들기
            </Link>
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

const validRegionID = (regionId: string | undefined): regionId is string =>
  typeof regionId === 'string' && regionId !== '';
