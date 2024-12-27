import type { ReactNode } from 'react';
import BlueLink from '@/components/link/BlueLink';
interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex items-center justify-between">
        <h1 className="text-[32px] font-500">쿠폰 관리</h1>
        <BlueLink href="/coupons/new">쿠폰 추가</BlueLink>
      </header>
      {children}
    </main>
  );
};

export default Layout;
