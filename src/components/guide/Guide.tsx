import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Guide = ({ children }: Props) => {
  return (
    <div className="rounded-lg bg-grey-50 p-8 text-[14px] text-grey-700 before:content-['도움말:']">
      {children}
    </div>
  );
};

export default Guide;
