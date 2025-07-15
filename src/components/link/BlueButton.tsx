import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const BlueButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={twMerge(
        'text-blue-500 after:content-["↗"] hover:underline disabled:cursor-not-allowed disabled:text-grey-500',
        props.className,
      )}
    >
      {props.children}
    </button>
  );
};

export default BlueButton;
