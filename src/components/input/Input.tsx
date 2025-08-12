'use client';

import {
  forwardRef,
  type Ref,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from 'react';
import { customTwMerge } from 'tailwind.config';

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  value?: string;
  setValue?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const Input = (
  { className, value, setValue, ...props }: Props,
  ref: Ref<HTMLInputElement>,
) => {
  return (
    <input
      ref={ref}
      value={value}
      onWheel={(event) => (event.target as HTMLElement).blur()}
      onChange={setValue && ((e) => setValue(e.target.value))}
      {...props}
      className={customTwMerge(
        'w-full rounded-8 border border-basic-grey-200 px-12 py-8 text-16 font-500 text-basic-black placeholder:text-basic-grey-500 focus:outline-brand-primary-300',
        className,
      )}
    />
  );
};

export default forwardRef(Input);
