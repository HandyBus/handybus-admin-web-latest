import type { ReactNode } from 'react';
import BlueLink from '@/components/link/BlueLink';
import Guide from '@/components/guide/Guide';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between items-center">
        <h1 className="text-[32px] font-500">거점지 대시보드</h1>
        <BlueLink href="/hubs/new">거점지 추가</BlueLink>
      </header>
      <Guide>
        <dfn>거점지</dfn>은 ...한 장소를 의미합니다. 거점지를 관리할 수 있는
        페이지입니다.
      </Guide>
      {children}
    </main>
  );
};

export default Layout;
