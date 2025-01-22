import Breadcrumbs from './Breadcrumbs';
import Nav from './Nav';
import type { ReactNode } from 'react';

const TopLevelLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="h-dvh w-dvw">
      <Nav />
      <div className="h-full w-full overflow-scroll bg-white p-32">
        <Breadcrumbs />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default TopLevelLayout;
