import { ReactNode } from 'react';
import Heading from '../text/Heading';

interface Props {
  title: string;
  children: ReactNode;
}

const ChartBox = ({ title, children }: Props) => {
  return (
    <article className="flex h-300 flex-col rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">
        {title}
      </Heading.h4>
      {children}
    </article>
  );
};

export default ChartBox;
