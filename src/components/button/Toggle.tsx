'use client';

import { CheckIcon, XIcon } from 'lucide-react';
import { Dispatch, MouseEvent, SetStateAction } from 'react';
import { twJoin } from 'tailwind-merge';

interface Props {
  value: boolean;
  disabled?: boolean;
  setValue?: Dispatch<SetStateAction<boolean>>;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  label: string;
}

/**
 * @param props - onClick이 setValue보다 우선합니다.
 */
const Toggle = ({ disabled, value, setValue, label, onClick }: Props) => {
  return (
    <button
      className={twJoin(
        'font-500 text-14 rounded-xl px-8 py-4 active:scale-90 transition-all border border-blue-100 hover:border-blue-600 flex flex-row items-center justify-start',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        value ? 'bg-blue-400 text-white' : 'bg-neutral-50',
      )}
      onClick={onClick ?? (setValue && (() => setValue((prev) => !prev)))}
      disabled={disabled}
    >
      {value ? <CheckIcon size={18} /> : <XIcon size={18} />} {label}
    </button>
  );
};

export default Toggle;
