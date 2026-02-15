import { ReactNode, Suspense } from 'react';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return <Suspense>{children}</Suspense>;
};

export default Layout;
