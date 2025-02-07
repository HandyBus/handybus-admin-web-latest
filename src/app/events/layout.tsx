import { ReactNode, Suspense } from 'react';

interface Props {
  children: ReactNode;
}

// NOTE useSearchParmas 때문에 Suspense로 한 번 감싸줘야 해서 추가함.
const Layout = ({ children }: Props) => {
  return <Suspense>{children}</Suspense>;
};

export default Layout;
