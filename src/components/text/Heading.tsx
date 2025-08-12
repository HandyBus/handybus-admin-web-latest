import { ReactNode } from 'react';
import { customTwMerge } from 'tailwind.config';
import { BackgroundColor, BACKGROUND_COLOR_MAP } from './color.const';

interface HeadingProps {
  children: ReactNode;
  backgroundColor?: BackgroundColor;
  className?: string;
}

const H1 = ({ children, backgroundColor, className }: HeadingProps) => {
  return (
    <h1
      className={customTwMerge(
        'my-4 h-56 p-4 text-[32px] font-600',
        backgroundColor && BACKGROUND_COLOR_MAP[backgroundColor],
        className,
      )}
    >
      {children}
    </h1>
  );
};

const H2 = ({ children, backgroundColor, className }: HeadingProps) => {
  return (
    <h2
      className={customTwMerge(
        'my-4 h-[50px] p-4 text-28 font-500',
        backgroundColor && BACKGROUND_COLOR_MAP[backgroundColor],
        className,
      )}
    >
      {children}
    </h2>
  );
};

const H3 = ({ children, backgroundColor, className }: HeadingProps) => {
  return (
    <h3
      className={customTwMerge(
        'my-4 h-44 p-4 text-24 font-500',
        backgroundColor && BACKGROUND_COLOR_MAP[backgroundColor],
        className,
      )}
    >
      {children}
    </h3>
  );
};

const H4 = ({ children, backgroundColor, className }: HeadingProps) => {
  return (
    <h4
      className={customTwMerge(
        'my-4 h-[38px] p-4 text-20 font-500',
        backgroundColor && BACKGROUND_COLOR_MAP[backgroundColor],
        className,
      )}
    >
      {children}
    </h4>
  );
};

const H5 = ({ children, backgroundColor, className }: HeadingProps) => {
  return (
    <h4
      className={customTwMerge(
        'my-4 h-32 p-4 text-16 font-500',
        backgroundColor && BACKGROUND_COLOR_MAP[backgroundColor],
        className,
      )}
    >
      {children}
    </h4>
  );
};

const Heading = Object.assign(H1, {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
});

export default Heading;
