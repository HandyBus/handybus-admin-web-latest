'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <div className="flex shrink-0 items-center gap-4 text-12 text-grey-600">
      <Link href="/" className="underline">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        return (
          <span key={to}>
            {' > '}
            <Link href={to} className="underline">
              {value}
            </Link>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
