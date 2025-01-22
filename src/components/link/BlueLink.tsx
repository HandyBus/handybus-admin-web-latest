import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

interface Props extends LinkProps {
  children: ReactNode;
}

const BlueLink = (props: Props) => {
  return (
    <Link
      {...props}
      className="text-blue-500 after:content-['↗'] hover:underline"
    >
      {props.children}
    </Link>
  );
};

export default BlueLink;
