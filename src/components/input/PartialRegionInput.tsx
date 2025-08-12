'use client';

import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from '@headlessui/react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { filterByFuzzy } from '@/utils/fuzzy.util';
import { ChevronDown, FileWarningIcon } from 'lucide-react';
import { customTwMerge } from 'tailwind.config';
import { getRegions } from '@/services/hub.service';
import { Region } from '@/types/region.type';

/**
 * PartialRegion 은 regionId가 없을 수 있는 지역 상태를 나타냅니다.
 */
export interface PartialRegion {
  province: string | null;
  city: string | null;
}

interface Props<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
}

const data = getRegions();
const provinces = Array.from(
  new Set(data.map((region) => region.provinceFullName)),
);

const PartialRegionInput = ({ value, setValue }: Props<PartialRegion>) => {
  const [queryBig, setQueryBig] = useState('');
  const [querySmall, setQuerySmall] = useState('');

  const filteredProvinces = useMemo(
    () => (queryBig ? filterByFuzzy(provinces, queryBig, (x) => x) : provinces),
    [queryBig],
  );

  const filteredCities = useMemo(() => {
    if (value.province === null) return [];
    return filterByFuzzy(
      data.filter((region) => region.provinceFullName === value.province),
      querySmall,
      (x) => x.cityFullName,
    );
  }, [querySmall, value.province]);

  const selectedCity = useMemo(() => {
    if (value.city === null) return null;
    return data.find(
      (region) =>
        region.provinceFullName === value.province &&
        region.cityFullName === value.city,
    );
  }, [value.city, value.province]);

  const isValid = isValidPartialRegion(value);

  return (
    <div className="flex w-full flex-col items-start justify-start">
      <Combobox
        immediate
        value={value.province}
        onChange={(newValue) => {
          if (value.province !== newValue)
            setValue({
              province: newValue,
              city: null,
            });
        }}
        onClose={() => {
          setQueryBig('');
        }}
      >
        <div className="group relative size-full">
          <ComboboxInput
            className={customTwMerge(
              `rounded-t-lg 
           size-full border border-basic-grey-200 p-8
           focus:outline-basic-blue-400`,
              isValid ? '' : 'text-basic-red-500',
            )}
            aria-label="Assignee"
            placeholder={'도/광역시 선택'}
            defaultValue={null}
            displayValue={(value) => (value === null ? '' : value)}
            onChange={(event) => setQueryBig(event.target.value)}
          />
          <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-basic-grey-400 group-focus:text-basic-blue-400">
            <ChevronDown />
          </ComboboxButton>
          <ComboboxOptions
            anchor="bottom"
            className="mt-4 w-[var(--input-width)] rounded-8 bg-basic-white shadow-md empty:invisible"
          >
            <ComboboxOption
              value={null}
              className="p-8 data-[focus]:bg-basic-blue-100"
            >
              전체
            </ComboboxOption>

            {filteredProvinces.map((province) => (
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
        value={selectedCity}
        onChange={(newValue) => {
          setValue({
            province: value.province,
            city: newValue?.cityFullName ?? null,
          });
        }}
        onClose={() => setQuerySmall('')}
      >
        <div className="group relative size-full">
          <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-basic-grey-400 group-focus:text-basic-blue-400">
            <ChevronDown />
          </ComboboxButton>
          <ComboboxInput
            className="rounded-b-lg size-full
            border border-basic-grey-200 border-t-transparent p-8
            focus:outline-basic-blue-400"
            aria-label="Assignee"
            placeholder={'시/군/구 선택'}
            defaultValue={null}
            displayValue={(city: Region | null) =>
              city === null ? '' : city.cityFullName
            }
            onChange={(event) => setQuerySmall(event.target.value)}
          />
          <ComboboxOptions
            anchor="bottom"
            className="mt-4 w-[var(--input-width)] rounded-8 bg-basic-white shadow-md empty:invisible"
          >
            <ComboboxOption
              value={null}
              className="p-8 data-[focus]:bg-basic-blue-100"
            >
              전체
            </ComboboxOption>
            {filteredCities.map((city) => (
              <ComboboxOption
                key={city.regionId}
                value={city}
                className="p-8 data-[focus]:bg-basic-blue-100"
              >
                {city.cityFullName}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>
      {!isValid && (
        <div className="flex flex-row items-center gap-4 text-basic-red-500">
          <FileWarningIcon size={16} /> 필터 오류, 이 지역 정보는 잘못된 것
          같습니다.
        </div>
      )}
    </div>
  );
};

export default PartialRegionInput;

const isValidPartialRegion = (value: PartialRegion) => {
  const provinceValid =
    value.province === null || provinces.includes(value.province);
  const cityValid =
    value.city === null ||
    (value.city !== null &&
      value.province !== null &&
      data.some(
        (region) =>
          region.cityFullName === value.city &&
          region.provinceFullName === value.province,
      ));
  return provinceValid && cityValid;
};
