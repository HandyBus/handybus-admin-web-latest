import type { HTMLProps } from 'react';
import Magnify from '@/icons/magnify.svg';

interface Props extends HTMLProps<HTMLButtonElement> {
  type?: 'submit' | 'reset' | 'button';
}

const SearchBarShapeButton = ({ children, ...rest }: Props) => {
  return (
    <button
      className="flex w-full items-center justify-start gap-[10px] overflow-hidden overflow-ellipsis whitespace-nowrap rounded-full border border-grey-100 px-16"
      {...rest}
    >
      <div className="self-center text-[22px] text-grey-400">
        <Magnify />
      </div>
      <span className="my-12 overflow-hidden overflow-ellipsis whitespace-nowrap text-grey-300">
        {children}
      </span>
    </button>
  );
};

export default SearchBarShapeButton;