import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';

interface DropdownProps<T> {
  // 필수 props
  value: T | null;
  onChange: (value: T | null) => void;
  options: T[];
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string | number;

  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;

  // 검색 관련
  searchable?: boolean;
  searchPlaceholder?: string;

  // 추가 옵션 (예: "새로 만들기" 링크)
  additionalOption?: {
    label: string;
    onClick?: () => void;
  };

  // 접근성
  ariaLabel?: string;
  name?: string;
}

const Dropdown = <T,>({
  value,
  onChange,
  options,
  getOptionLabel,
  getOptionValue,
  placeholder = '선택해주세요',
  isLoading = false,
  disabled = false,
  searchable = true,
  additionalOption,
  ariaLabel = '드롭다운',
  name,
}: DropdownProps<T>) => {
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchable || !query) return options;

    return options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(query.toLowerCase()),
    );
  }, [options, query, searchable, getOptionLabel]);

  const handleClose = () => {
    setQuery('');
  };

  const handleChange = (newValue: T | null) => {
    onChange(newValue);
    setQuery('');
  };

  const displayValue = value ? getOptionLabel(value) : '';

  return (
    <Combobox
      immediate
      value={value}
      onChange={handleChange}
      onClose={handleClose}
      disabled={disabled}
    >
      <div className="group relative">
        <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-basic-grey-400 group-focus:text-brand-primary-400">
          <ChevronDown />
        </ComboboxButton>

        <ComboboxInput
          className="size-full rounded-8 border border-basic-grey-200 p-8 focus:outline-brand-primary-300"
          aria-label={ariaLabel}
          placeholder={isLoading ? '로딩 중…' : placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          name={name}
          displayValue={() => displayValue}
        />

        <ComboboxOptions
          anchor="bottom"
          className="mt-4 w-[var(--input-width)] rounded-8 bg-basic-white shadow-md empty:invisible"
        >
          {filteredOptions.map((option) => (
            <ComboboxOption
              key={getOptionValue(option)}
              value={option}
              className="p-8 data-[focus]:bg-brand-primary-100"
            >
              {getOptionLabel(option)}
            </ComboboxOption>
          ))}

          {filteredOptions.length === 0 && query && !isLoading && (
            <div className="p-8 text-center text-basic-grey-400">
              검색 결과가 없습니다
            </div>
          )}

          {additionalOption && (
            <button
              type="button"
              className="block p-8 text-brand-primary-400 hover:bg-brand-primary-100"
              onClick={additionalOption.onClick}
            >
              {additionalOption.label}
            </button>
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default Dropdown;
