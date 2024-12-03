import Link from 'next/link';
import LoginPage from '../login/page';
import { getAccessToken } from '@/utils/auth.util';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout = async ({ children }: Props) => {
  return (
    <main className="flex h-full w-full flex-col items-center justify-start gap-16 bg-white p-16">
      <h1 className="text-[32px] font-500">핸디버스 관리자 대시보드</h1>
      {(await getAccessToken()) ? (
        <>
          <a href="/logout">로그아웃</a>
          <div>{children}</div>
        </>
      ) : (
        <div className=" w-fit overflow-hidden rounded-lg border border-grey-100">
          <pre className="border-b border-b-grey-100 bg-grey-50 p-8">
            <Link href="/login">{'/login'}</Link>
          </pre>
          <div className="p-8">
            <LoginPage />
          </div>
        </div>
      )}
    </main>
  );
};

export default Layout;
