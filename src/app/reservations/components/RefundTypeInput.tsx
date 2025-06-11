import { RefundRequestType } from '@/types/payment.type';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import Stringifier from '@/utils/stringifier.util';

interface Props {
  value: RefundRequestType;
  onChange: (value: RefundRequestType) => void;
  options: readonly RefundRequestType[];
}

const RefundTypeInput = ({ value, onChange, options }: Props) => {
  return (
    <Combobox immediate value={value} onChange={onChange}>
      <div className="group relative">
        <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
          <ChevronDown />
        </ComboboxButton>
        <ComboboxInput
          className="size-full rounded-lg border border-grey-200 p-8 focus:outline-blue-400"
          aria-label="Assignee"
          placeholder="환불 유형"
          displayValue={(value: RefundRequestType) =>
            value ? Stringifier.refundRequestType(value) : ''
          }
          readOnly
        />
        <ComboboxOptions
          anchor="bottom"
          className="mt-4 w-[var(--input-width)] rounded-lg bg-white shadow-md empty:invisible"
        >
          {options.map((option) => (
            <ComboboxOption
              key={option}
              value={option}
              className="p-8 data-[focus]:bg-blue-100"
            >
              {Stringifier.refundRequestType(option)}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default RefundTypeInput;
