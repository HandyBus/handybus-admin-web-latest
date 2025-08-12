import { Dispatch } from 'react';
import Toggle from '@/components/button/Toggle';
import { DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import { FilterIcon } from 'lucide-react';
import {
  AnnouncementFilterState,
  AnnouncementFilterAction,
} from '../hooks/useAnnouncementFilter';

const AnnouncementFilter = ({
  option,
  dispatch,
}: {
  option: AnnouncementFilterState;
  dispatch: Dispatch<AnnouncementFilterAction>;
}) => (
  <Disclosure>
    <DisclosureButton className="group flex w-fit items-center justify-start gap-4 rounded-[8px] p-4 transition-all hover:bg-basic-grey-50 active:scale-90 active:bg-basic-grey-100">
      <FilterIcon size={16} />
      <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
    </DisclosureButton>
    <DisclosurePanel className="bg-notion-green/50 mb-8 flex flex-col gap-4 rounded-[4px] p-16">
      <div className="flex flex-row gap-4">
        <Toggle
          label="삭제된 공지글 포함"
          value={option.withDeleted === true}
          setValue={() =>
            dispatch({ type: 'SET_WITH_DELETED', withDeleted: true })
          }
        />
        <Toggle
          label="삭제된 공지글 제외"
          value={option.withDeleted === false}
          setValue={() =>
            dispatch({ type: 'SET_WITH_DELETED', withDeleted: false })
          }
        />
      </div>
    </DisclosurePanel>
  </Disclosure>
);

export default AnnouncementFilter;
