import Loading from '@/components/loading/Loading';
import { useGetRegionHubs } from '@/services/hub.service';
import { RegionHubsViewEntity } from '@/types/hub.type';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';

interface Props {
  eventPlace: RegionHubsViewEntity | null;
  setEventPlace: (eventPlace: RegionHubsViewEntity | null) => void;
  placeholder?: string;
}

const EventPlaceSelect = ({
  eventPlace,
  setEventPlace,
  placeholder = '행사장소를 선택해주세요. 행사 장소와 상세주소가 표시됩니다',
}: Props) => {
  const {
    data: regionHubs,
    isLoading: isRegionHubsLoading,
    isError: isRegionHubsError,
  } = useGetRegionHubs({
    options: {
      page: undefined,
      usageType: ['EVENT_LOCATION'],
    },
  });

  const eventLocationHubs = useMemo(
    () => regionHubs?.pages.flatMap((page) => page.regionHubs),
    [regionHubs],
  );

  if (isRegionHubsError) throw new Error('행사장소 데이터 조회 실패');
  if (isRegionHubsLoading) return <Loading />;
  return (
    <Combobox
      immediate
      value={eventPlace}
      onChange={(value) => {
        setEventPlace(value);
      }}
    >
      <div className="group relative w-full">
        <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-basic-grey-400 group-focus:text-basic-blue-400">
          <ChevronDown />
        </ComboboxButton>
        <ComboboxInput
          className="size-full rounded-8 border border-basic-grey-200 bg-basic-white p-8 focus:outline-basic-blue-400"
          placeholder={placeholder}
          defaultValue={eventLocationHubs[0] ?? null}
          displayValue={(hub: RegionHubsViewEntity | null) => hub?.name ?? ''}
          autoComplete="off"
          disabled={eventLocationHubs.length === 0}
        />
        <ComboboxOptions
          anchor="bottom"
          className="mt-4 w-[var(--input-width)] rounded-8 bg-basic-white shadow-md empty:invisible"
        >
          {eventLocationHubs?.map((hub) => (
            <ComboboxOption
              key={hub.regionHubId}
              value={hub}
              className="p-8 data-[focus]:bg-basic-blue-100"
            >
              {hub.name} ({hub.address})
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default EventPlaceSelect;
