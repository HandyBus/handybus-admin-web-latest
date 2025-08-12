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
      className={`block cursor-pointer whitespace-nowrap break-keep text-20 transition-opacity hover:opacity-30
          ${firstPath === firstHref ? 'font-700 text-basic-white' : 'font-400 text-basic-grey-100'}`}
    >
      {children}
    </Link>
  );
};

export default NavItem;
