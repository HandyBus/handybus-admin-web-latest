import { InfoIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ToolTip = ({ children }: Props) => {
  return (
    <div className="group relative">
      <InfoIcon size={16} className="text-grey-500 hover:text-grey-800" />
      <div className="absolute bottom-20 hidden w-280 rounded-[4px] bg-white p-[6px] text-12 text-grey-800 opacity-95 shadow-md group-hover:block">
        {children}
      </div>
    </div>
  );
};

export default ToolTip;
