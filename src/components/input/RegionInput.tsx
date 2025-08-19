'use client';

import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
import { filterByFuzzy } from '@/utils/fuzzy.util';
import { ChevronDown } from 'lucide-react';
import {
  BIG_REGIONS,
  BigRegionsType,
  ID_TO_REGION,
  REGION_TO_ID,
  SMALL_REGIONS,
} from '@/constants/regions';

interface Props {
  value: string | null;
  setValue: (value: string | null) => void;
  disabled?: boolean;
}

const RegionInput = ({ value, setValue, disabled }: Props) => {
  const [queryBig, setQueryBig] = useState('');
  const [querySmall, setQuerySmall] = useState('');

  const [selectedBigRegion, setSelectedBigRegion] =
    useState<BigRegionsType | null>(null);
  const [selectedSmallRegion, setSelectedSmallRegion] = useState<string | null>(
    null,
  );

  const filteredBigRegions = useMemo(
    () =>
      queryBig ? filterByFuzzy(BIG_REGIONS, queryBig, (x) => x) : BIG_REGIONS,
    [queryBig],
  );

  const filteredSmallRegions = useMemo(() => {
    if (!selectedBigRegion) {
      return [];
    }
    const smallRegions = Array.from(
      SMALL_REGIONS[selectedBigRegion],
    ).toSorted();
    return querySmall
      ? filterByFuzzy(smallRegions, querySmall, (x) => x)
      : smallRegions;
  }, [selectedBigRegion, querySmall]);

  useEffect(() => {
    // value가 초기화 또는 변경되었을 때
    // 값이 있으면
    if (value) {
      const region = ID_TO_REGION?.[value];
      setSelectedBigRegion(region?.bigRegion || null);
      setSelectedSmallRegion(region?.smallRegion || null);
    }
  }, [value]);

  useEffect(() => {
    if (selectedBigRegion && selectedSmallRegion) {
      setValue(REGION_TO_ID[selectedBigRegion][selectedSmallRegion] || null);
    }
  }, [selectedBigRegion, selectedSmallRegion]);

  return (
    <div className="flex w-full flex-col items-start justify-start">
      <Combobox
        immediate
        value={selectedBigRegion}
        onChange={(value) => {
          if (selectedBigRegion !== value) {
            setValue(null);
            setSelectedSmallRegion(null);
          }

          if (value && BIG_REGIONS.includes(value)) {
            setSelectedBigRegion(value);
          } else {
            setSelectedBigRegion(null);
          }
        }}
        onClose={() => {
          setQueryBig('');
        }}
      >
        <div className="group relative size-full">
          <ComboboxInput
            className="rounded-t-lg 
           size-full border border-basic-grey-200 p-8
           focus:outline-basic-blue-400"
            aria-label="Assignee"
            placeholder={'도/광역시'}
            defaultValue={null}
            displayValue={(province) => (province === null ? '' : province)}
            onChange={(event) => setQueryBig(event.target.value)}
            autoComplete="off"
            disabled={disabled}
          />
          <ComboboxButton
            disabled={disabled}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-basic-grey-400 group-focus:text-basic-blue-400"
          >
            <ChevronDown />
          </ComboboxButton>
          <ComboboxOptions
            anchor="bottom"
            className="mt-4 w-[var(--input-width)] rounded-8 bg-basic-white shadow-md empty:invisible"
          >
            {filteredBigRegions.map((province) => (
              <ComboboxOption
                key={province}
                value={province}
                className="p-8 data-[focus]:bg-basic-blue-100"
              >
                {province}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>

      <Combobox
        immediate
        value={selectedSmallRegion}
        onChange={(value) => {
          setSelectedSmallRegion(value);
        }}
        onClose={() => setQuerySmall('')}
      >
        <div className="group relative size-full">
          <ComboboxButton
            disabled={disabled}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-basic-grey-400 group-focus:text-basic-blue-400"
          >
            <ChevronDown />
          </ComboboxButton>
          <ComboboxInput
            className="rounded-b-lg size-full
            border border-basic-grey-200 border-t-transparent p-8
            focus:outline-basic-blue-400"
            aria-label="Assignee"
            placeholder={'시/군/구'}
            defaultValue={null}
            displayValue={(smallRegion: string | null) => smallRegion ?? ''}
            onChange={(event) => setQuerySmall(event.target.value)}
            autoComplete="off"
            disabled={disabled}
          />
          <ComboboxOptions
            anchor="bottom"
            className="mt-4 w-[var(--input-width)] rounded-8 bg-basic-white shadow-md empty:invisible"
          >
            {filteredSmallRegions.map((smallRegion) => (
              <ComboboxOption
                key={smallRegion}
                value={smallRegion}
                className="p-8 data-[focus]:bg-basic-blue-100"
              >
                {smallRegion}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
};

export default RegionInput;
