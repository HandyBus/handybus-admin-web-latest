import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex size-full flex-col gap-16 bg-white ">
      <h1 className="text-[32px] font-500">셔틀 상세</h1>
      {children}
    </main>
  );
};

export default Layout;
