import type { ReactNode } from 'react';
import BlueLink from '@/components/link/BlueLink';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">셔틀 대시보드</h1>
        <BlueLink href="shuttles/new">추가하기</BlueLink>
      </header>
      {children}
    </main>
  );
};

export default Layout;
