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
  value: string | number;
  setValue: (value: string | number) => void;
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
      onChange={(e) =>
        setValue(
          props.type === 'number' ? Number(e.target.value) : e.target.value,
        )
      }
      className="w-full p-8 border border-grey-200 rounded-lg focus:outline-blue-400"
    />
  );
};

export default forwardRef(Input);
