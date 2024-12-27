'use client';
import { useQuery } from '@tanstack/react-query';
import { getRegions } from '@/app/actions/regions.action';
// import { Autocomplete, TextField, CircularProgress, Stack } from '@mui/material';
import { RegionType } from '@/types/region.type';
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

interface Props {
  value: number | null;
  setValue: (value: number | null) => void;
}

const RegionInput = ({ value, setValue }: Props) => {
  const [queryBig, setQueryBig] = useState('');
  const [querySmall, setQuerySmall] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => await getRegions(),
  });

  // Get unique provinces
  const provinces = Array.from(
    new Set(data?.map((region) => region.provinceFullName) || []),
  );

  // Get cities for selected province
  const cities = useMemo(() => data || [], [data]);

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const filteredCities = useMemo(() => {
    const contained = cities.filter(
      (city) => city.provinceFullName === selectedProvince,
    );
    return querySmall
      ? filterByFuzzy(contained, querySmall, (x) => x.cityFullName)
      : contained;
  }, [cities, selectedProvince, querySmall]);

  const selectedCity = useMemo(() => {
    return cities.find((city) => city.regionId === value) || null;
  }, [cities, value]);

  const filteredProvinces = useMemo(
    () => (queryBig ? filterByFuzzy(provinces, queryBig, (x) => x) : provinces),
    [provinces, queryBig],
  );

  useEffect(() => {
    // value가 초기화 또는 변경되었을 때
    // 값이 있으면
    if (value) {
      setSelectedProvince(
        cities.find((city) => city.regionId === value)?.provinceFullName ||
          null,
      );
    }
  }, [cities, value]);

  if (error) return <div>Failed to load regions</div>;
  return (
    <div className="flex flex-col justify-start items-start w-full">
      <Combobox
        immediate
        value={selectedProvince}
        onChange={(value) => {
          if (selectedCity?.cityFullName !== value) {
            setValue(null);
          }

          if (value && provinces.includes(value)) {
            setSelectedProvince(value);
          } else {
            setSelectedProvince(null);
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
            placeholder={isLoading ? '로딩 중…' : '도/광역시 선택'}
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
        onChange={(value) => {
          setValue(value?.regionId || null);
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
            placeholder={isLoading ? '로딩 중…' : '시/군/구 선택'}
            defaultValue={null}
            displayValue={(city: RegionType | null) =>
              city === null ? '' : city.cityFullName
            }
            onChange={(event) => setQuerySmall(event.target.value)}
          />
          <ComboboxOptions
            anchor="bottom"
            className="w-[var(--input-width)] shadow-md bg-white rounded-lg empty:invisible mt-4"
          >
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
    </div>
  );
};

export default RegionInput;
