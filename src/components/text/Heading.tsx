import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type BackgroundColor = 'grey' | 'primary' | 'blue' | 'red';

const BACKGROUND_COLOR_MAP = {
  grey: 'bg-grey-100/60',
  primary: 'bg-primary-100/60',
  blue: 'bg-blue-100/50',
  red: 'bg-red-100/60',
};

interface HeadingProps {
  children: ReactNode;
  backgroundColor?: BackgroundColor;
}

const H1 = ({ children, backgroundColor }: HeadingProps) => {
  return (
    <h1
      className={twMerge(
        'my-[2px] px-[2px] text-[32px] font-600',
        backgroundColor && BACKGROUND_COLOR_MAP[backgroundColor],
      )}
    >
      {children}
    </h1>
  );
};

const H2 = ({ children, backgroundColor }: HeadingProps) => {
  return (
    <h2
      className={twMerge(
        'my-[2px] px-[2px] text-28 font-500',
        backgroundColor && BACKGROUND_COLOR_MAP[backgroundColor],
      )}
    >
      {children}
    </h2>
  );
};

const H3 = ({ children, backgroundColor }: HeadingProps) => {
  return (
    <h3
      className={twMerge(
        'my-[2px] px-[2px] text-24 font-500',
        backgroundColor && BACKGROUND_COLOR_MAP[backgroundColor],
      )}
    >
      {children}
    </h3>
  );
};

const H4 = ({ children, backgroundColor }: HeadingProps) => {
  return (
    <h3
      className={twMerge(
        'my-[2px] px-[2px] text-20 font-400',
        backgroundColor && BACKGROUND_COLOR_MAP[backgroundColor],
      )}
    >
      {children}
    </h3>
  );
};

export const Heading = Object.assign(H1, {
  H2,
  H3,
  H4,
});

export default Heading;
