import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const List = ({ children }: Props) => {
  return <article className="grid grid-cols-[72px_1fr]">{children}</article>;
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
