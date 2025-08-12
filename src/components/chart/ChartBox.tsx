import { ReactNode } from 'react';
import Heading from '../text/Heading';

interface Props {
  title: ReactNode;
  children: ReactNode;
}

const ChartBox = ({ title, children }: Props) => {
  return (
    <article className="flex h-300 grow flex-col rounded-[4px] border border-basic-grey-200 bg-basic-white p-4">
      <Heading.h4 className="text-basic-grey-900 flex items-baseline text-14 font-600">
        {title}
      </Heading.h4>
      {children}
    </article>
  );
};

export default ChartBox;
