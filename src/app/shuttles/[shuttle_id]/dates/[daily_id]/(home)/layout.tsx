import { type PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">일자별 셔틀 상세</h1>
      </header>
      {children}
    </main>
  );
};

export default Layout;
