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
}

const RegionInput = ({ value, setValue }: Props) => {
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
    const smallRegions = SMALL_REGIONS[selectedBigRegion];
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
            className="size-full 
           rounded-t-lg border border-grey-200 p-8
           focus:outline-blue-400"
            aria-label="Assignee"
            placeholder={'도/광역시 선택'}
            defaultValue={null}
            displayValue={(province) => (province === null ? '' : province)}
            onChange={(event) => setQueryBig(event.target.value)}
            autoComplete="off"
          />
          <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
            <ChevronDown />
          </ComboboxButton>
          <ComboboxOptions
            anchor="bottom"
            className="mt-4 w-[var(--input-width)] rounded-lg bg-white shadow-md empty:invisible"
          >
            {filteredBigRegions.map((province) => (
              <ComboboxOption
                key={province}
                value={province}
                className="p-8 data-[focus]:bg-blue-100"
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
          <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
            <ChevronDown />
          </ComboboxButton>
          <ComboboxInput
            className="size-full rounded-b-lg
            border border-grey-200 border-t-transparent p-8
            focus:outline-blue-400"
            aria-label="Assignee"
            placeholder={'시/군/구 선택'}
            defaultValue={null}
            displayValue={(smallRegion: string | null) => smallRegion ?? ''}
            onChange={(event) => setQuerySmall(event.target.value)}
            autoComplete="off"
          />
          <ComboboxOptions
            anchor="bottom"
            className="mt-4 w-[var(--input-width)] rounded-lg bg-white shadow-md empty:invisible"
          >
            {filteredSmallRegions.map((smallRegion) => (
              <ComboboxOption
                key={smallRegion}
                value={smallRegion}
                className="p-8 data-[focus]:bg-blue-100"
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
