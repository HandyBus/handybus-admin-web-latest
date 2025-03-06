'use client';

import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value: number;
  setValue: (value: number) => void;
  placeholder?: string;
  className?: string;
}

// NOTE: react hook form의 register을 직접 내려주지 않고 Controller으로 감싸서 사용해야 함
const NumberInput = ({
  value,
  setValue,
  placeholder,
  className,
  ...props
}: Props) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <input
      type="text"
      value={formatNumber(value)}
      onChange={(e) => {
        const numericValue = Number(e.target.value.replace(/,/g, ''));
        setValue(numericValue);
      }}
      placeholder={placeholder}
      className={twMerge(
        'w-full rounded-lg border border-grey-200 p-8 focus:outline-blue-400',
        className,
      )}
      {...props}
    />
  );
};

export default NumberInput;
