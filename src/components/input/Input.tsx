'use client';
import {
  forwardRef,
  type Ref,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from 'react';
import { twMerge } from 'tailwind-merge';

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
      className={twMerge(
        'w-full p-8 border border-grey-200 rounded-lg focus:outline-blue-400',
        className,
      )}
    />
  );
};

export default forwardRef(Input);
