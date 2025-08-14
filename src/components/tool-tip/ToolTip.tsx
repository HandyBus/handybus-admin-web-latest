import { InfoIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { customTwMerge } from 'tailwind.config';

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
        className={customTwMerge(
          'text-basic-grey-500 hover:text-basic-grey-700',
          iconClassName,
        )}
      />
      <div
        className={customTwMerge(
          'absolute bottom-20 hidden max-w-300 whitespace-nowrap break-keep rounded-[4px] bg-basic-white p-[6px] text-12 text-basic-grey-700 opacity-95 shadow-md group-hover:block',
          textClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ToolTip;
