import Breadcrumbs from './Breadcrumbs';
import Nav from './Nav';
import type { ReactNode } from 'react';

const TopLevelLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex h-dvh w-dvw flex-col">
      <Nav />
      <div className="flex grow flex-col overflow-scroll bg-white p-32">
        <Breadcrumbs />
        {children}
      </div>
    </div>
  );
};

export default TopLevelLayout;
