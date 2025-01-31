import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout = async ({ children }: Props) => {
  return (
    <main className="flex h-full w-full flex-col items-center justify-start gap-16 bg-white p-16">
      <h1 className="text-[32px] font-500">핸디버스 관리자 대시보드</h1>
      {children}
    </main>
  );
};

export default Layout;
