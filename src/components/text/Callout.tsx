import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Callout = ({ children }: Props) => {
  return (
    <section className="bottom-12 my-4 bg-notion-grey px-8 py-4 text-16">
      {children}
    </section>
  );
};

export default Callout;
