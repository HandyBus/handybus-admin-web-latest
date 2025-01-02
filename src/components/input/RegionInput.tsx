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
  value: number | null;
  setValue: (value: number | null) => void;
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
    <div className="flex flex-col justify-start items-start w-full">
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
        <div className="relative group size-full">
          <ComboboxInput
            className="p-8 
           border border-grey-200 rounded-t-lg size-full
           focus:outline-blue-400"
            aria-label="Assignee"
            placeholder={'도/광역시 선택'}
            defaultValue={null}
            displayValue={(province) => (province === null ? '' : province)}
            onChange={(event) => setQueryBig(event.target.value)}
          />
          <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
            <ChevronDown />
          </ComboboxButton>
          <ComboboxOptions
            anchor="bottom"
            className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
          >
            {filteredBigRegions.map((province) => (
              <ComboboxOption
                key={province}
                value={province}
                className="data-[focus]:bg-blue-100 p-8"
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
        <div className="relative group size-full">
          <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
            <ChevronDown />
          </ComboboxButton>
          <ComboboxInput
            className="p-8 focus:outline-blue-400
            border border-grey-200 rounded-b-lg size-full
            border-t-transparent"
            aria-label="Assignee"
            placeholder={'시/군/구 선택'}
            defaultValue={null}
            displayValue={(smallRegion: string | null) => smallRegion ?? ''}
            onChange={(event) => setQuerySmall(event.target.value)}
          />
          <ComboboxOptions
            anchor="bottom"
            className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
          >
            {filteredSmallRegions.map((smallRegion) => (
              <ComboboxOption
                key={smallRegion}
                value={smallRegion}
                className="data-[focus]:bg-blue-100 p-8"
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
