'use client';

import {
  forwardRef,
  type Ref,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from 'react';

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  value: number;
  setValue: (value: number) => void;
  placeholder?: string;
}

const NumberInput = (
  { value, setValue, ...props }: Props,
  ref: Ref<HTMLInputElement>,
) => {
  return (
    <input
      ref={ref}
      type="number"
      {...props}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
      className="w-full rounded-lg border border-grey-200 p-8 focus:outline-blue-400"
    />
  );
};

export default forwardRef(NumberInput);
