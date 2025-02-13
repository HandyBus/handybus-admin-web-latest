import { InfoIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  children: ReactNode;
  iconClassName?: string;
  textClassName?: string;
}

const ToolTip = ({ children, iconClassName, textClassName }: Props) => {
  return (
    <div className="group relative">
      <InfoIcon
        size={16}
        className={twMerge('text-grey-500 hover:text-grey-800', iconClassName)}
      />
      <div
        className={twMerge(
          'absolute bottom-20 hidden max-w-300 whitespace-nowrap break-keep rounded-[4px] bg-white p-[6px] text-12 text-grey-800 opacity-95 shadow-md group-hover:block',
          textClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ToolTip;
