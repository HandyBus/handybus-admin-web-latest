import Nav from './Nav';
import type { ReactNode } from 'react';

const TopLevelLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex h-dvh w-dvw flex-row gap-12 bg-primary-50 p-12">
      <Nav />
      <div className="h-full w-full overflow-scroll rounded-lg border border-primary-main bg-white">
        <div className="p-32">{children}</div>
      </div>
    </div>
  );
};

export default TopLevelLayout;
