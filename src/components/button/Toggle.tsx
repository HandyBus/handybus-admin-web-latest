'use client';

import { Dispatch, MouseEvent, SetStateAction } from 'react';
import { customTwMerge } from 'tailwind.config';

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
      className={customTwMerge(
        'flex items-center justify-start rounded-8 border border-brand-primary-200 px-[10px] py-[6px] text-14 font-500 transition-transform active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        value && 'border-transparent bg-brand-primary-400 text-basic-white',
      )}
      onClick={onClick ?? (setValue && (() => setValue((prev) => !prev)))}
      disabled={disabled}
      type="button"
    >
      {label}
    </button>
  );
};

export default Toggle;
