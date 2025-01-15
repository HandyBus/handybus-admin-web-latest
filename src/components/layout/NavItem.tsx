'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Props {
  href: string;
  children: ReactNode;
}

const NavItem = ({ href, children }: Props) => {
  const firstHref = href.split('/').at(1);
  const firstPath = usePathname().split('/').at(1);
  return (
    <Link
      href={href}
      className={`block cursor-pointer text-20 break-keep transition-opacity hover:opacity-30 
          ${firstPath === firstHref ? 'font-700 text-white' : 'font-400 text-grey-100'}`}
    >
      {children}
    </Link>
  );
};

export default NavItem;
