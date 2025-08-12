import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    disabled?: boolean;
  };

const BlueLink = ({ className, children, disabled, ...props }: Props) => {
  return (
    <Link
      {...props}
      className={`whitespace-nowrap break-keep text-basic-blue-400 underline underline-offset-[3px] ${className || ''} ${disabled ? 'pointer-events-none text-basic-grey-300' : ''}`}
    >
      {children}
    </Link>
  );
};

export default BlueLink;
