import Heading from '@/components/text/Heading';
import type { ReactNode } from 'react';
interface Props {
  children: ReactNode;
}

const Page = ({ children }: Props) => {
  return (
    <main>
      <Heading>채용 공고 추가하기</Heading>
      {children}
    </main>
  );
};

export default Page;
