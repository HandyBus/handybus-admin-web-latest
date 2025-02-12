import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

const BlueLink = ({ className, children, ...props }: Props) => {
  return (
    <Link
      {...props}
      className={`whitespace-nowrap break-keep text-blue-500 underline underline-offset-[3px] ${className || ''}`}
    >
      {children}
    </Link>
  );
};

export default BlueLink;
