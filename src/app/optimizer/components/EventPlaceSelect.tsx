import { RegionHubsViewEntity } from '@/types/hub.type';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

interface Props {
  eventPlace: RegionHubsViewEntity | null;
  setEventPlace: (eventPlace: RegionHubsViewEntity | null) => void;
  eventLocationHubs: RegionHubsViewEntity[];
}

const EventPlaceSelect = ({
  eventPlace,
  setEventPlace,
  eventLocationHubs,
}: Props) => {
  return (
    <Combobox
      immediate
      value={eventPlace}
      onChange={(value) => {
        setEventPlace(value);
      }}
    >
      <div className="group relative w-4/12">
        <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
          <ChevronDown />
        </ComboboxButton>
        <ComboboxInput
          className="size-full rounded-lg border border-grey-200 bg-white p-8 focus:outline-blue-400"
          placeholder={
            '행사장소를 선택해주세요. 행사 장소와 상세주소가 표시됩니다'
          }
          defaultValue={eventLocationHubs[0] ?? null}
          displayValue={(hub: RegionHubsViewEntity | null) => hub?.name ?? ''}
          autoComplete="off"
          disabled={eventLocationHubs.length === 0}
        />
        <ComboboxOptions
          anchor="bottom"
          className="mt-4 w-[var(--input-width)] rounded-lg bg-white shadow-md empty:invisible"
        >
          {eventLocationHubs?.map((hub) => (
            <ComboboxOption
              key={hub.regionHubId}
              value={hub}
              className="p-8 data-[focus]:bg-blue-100"
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
