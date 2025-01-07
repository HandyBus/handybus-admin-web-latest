'use client';

import { CheckIcon, XIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { twJoin } from 'tailwind-merge';

interface Props {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  label: string;
}

const Toggle = ({ value, setValue, label }: Props) => {
  return (
    <button
      className={twJoin(
        'font-500 text-sm rounded-xl px-8 py-4 active:scale-90 transition-all border border-blue-100 hover:border-blue-600 flex flex-row items-center justify-start',
        value ? 'bg-blue-400 text-white' : 'bg-neutral-50',
      )}
      onClick={() => setValue((prev) => !prev)}
    >
      {value ? <CheckIcon size={18} /> : <XIcon size={18} />} {label}
    </button>
  );
};

export default Toggle;
