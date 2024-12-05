import type { ReactNode } from 'react';
import UploadImagePage from '@/app/upload-image/page';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <h1 className="text-[32px] font-500">셔틀 추가하기</h1>
      {children}
      <h1 className="text-[16px] font-500">헬퍼 - 이미지 업로드하기</h1>
      <UploadImagePage />
    </main>
  );
};

export default Layout;
