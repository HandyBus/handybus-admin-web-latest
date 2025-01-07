import type { ReactNode } from 'react';
interface Props {
  children: ReactNode;
}

const Page = ({ children }: Props) => {
  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <h1 className="text-[32px] font-500">셔틀 추가하기</h1>
      {children}
    </main>
  );
};

export default Page;
