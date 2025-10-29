import { ButtonHTMLAttributes } from 'react';
import { customTwMerge } from 'tailwind.config';

const BlueButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={customTwMerge(
        'whitespace-nowrap break-keep text-basic-blue-400 after:content-["↗"] hover:underline disabled:cursor-not-allowed disabled:text-basic-grey-500',
        props.className,
      )}
    >
      {props.children}
    </button>
  );
};

export default BlueButton;
