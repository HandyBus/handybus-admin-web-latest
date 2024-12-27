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
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
}

const Input = (
  { value, setValue, ...props }: Props,
  ref: Ref<HTMLInputElement>,
) => {
  return (
    <input
      ref={ref}
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full p-8 border border-grey-200 rounded-lg focus:outline-blue-400"
    />
  );
};

export default forwardRef(Input);
