'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavItem = ({
  href,
  children,
}: Readonly<{ href: string; children: ReactNode }>) => {
  const firstHref = href.split('/').at(1);
  const firstPath = usePathname().split('/').at(1);
  return (
    <li>
      <Link
        href={href}
        className={
          `cursor-pointer break-keep transition-opacity hover:opacity-20 ` +
          (firstPath === firstHref ? 'font-700' : 'font-400')
        }
      >
        {children}
      </Link>
    </li>
  );
};

export default NavItem;
