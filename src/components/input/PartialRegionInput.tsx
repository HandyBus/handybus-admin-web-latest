'use client';
import { getRegions } from '@/services/v1/region.services';
import { Region } from '@/types/v1/region.type';
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
import { twMerge } from 'tailwind-merge';

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
    <div className="flex flex-col justify-start items-start w-full">
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
        <div className="relative group size-full">
          <ComboboxInput
            className={twMerge(
              `p-8 
           border border-grey-200 rounded-t-lg size-full
           focus:outline-blue-400`,
              isValid ? '' : 'text-red-500',
            )}
            aria-label="Assignee"
            placeholder={'도/광역시 선택'}
            defaultValue={null}
            displayValue={(value) => (value === null ? '' : value)}
            onChange={(event) => setQueryBig(event.target.value)}
          />
          <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
            <ChevronDown />
          </ComboboxButton>
          <ComboboxOptions
            anchor="bottom"
            className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
          >
            <ComboboxOption
              value={null}
              className="data-[focus]:bg-blue-100 p-8"
            >
              전체
            </ComboboxOption>

            {filteredProvinces.map((province) => (
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
        value={selectedCity}
        onChange={(newValue) => {
          setValue({
            province: value.province,
            city: newValue?.cityFullName ?? null,
          });
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
            displayValue={(city: Region | null) =>
              city === null ? '' : city.cityFullName
            }
            onChange={(event) => setQuerySmall(event.target.value)}
          />
          <ComboboxOptions
            anchor="bottom"
            className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
          >
            <ComboboxOption
              value={null}
              className="data-[focus]:bg-blue-100 p-8"
            >
              전체
            </ComboboxOption>
            {filteredCities.map((city) => (
              <ComboboxOption
                key={city.regionId}
                value={city}
                className="data-[focus]:bg-blue-100 p-8"
              >
                {city.cityFullName}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>
      {!isValid && (
        <div className="text-red-500 flex flex-row items-center gap-4">
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
