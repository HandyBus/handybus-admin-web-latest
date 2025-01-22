import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

const BlueLink = ({ className, children, ...props }: Props) => {
  return (
    <Link
      {...props}
      className={`text-blue-500 after:content-['↗'] hover:underline ${className || ''}`}
    >
      {children}
    </Link>
  );
};

export default BlueLink;
