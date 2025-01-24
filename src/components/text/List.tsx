import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  children: ReactNode;
  className?: string;
}

const List = ({ children, className }: Props) => {
  return (
    <article className={twMerge('grid grid-cols-[72px_1fr]', className)}>
      {children}
    </article>
  );
};

export default List;

interface ItemProps {
  title: string;
  children: ReactNode;
}

const Item = ({ title, children }: ItemProps) => {
  return (
    <>
      <div className="font-500">{title}</div>
      <div>
        <span className="pr-4 font-500">:</span> {children}
      </div>
    </>
  );
};

List.item = Item;
