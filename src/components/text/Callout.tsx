import { ReactNode } from 'react';
import { BackgroundColor, BACKGROUND_COLOR_MAP } from './color.const';
import { customTwMerge } from 'tailwind.config';

interface Props {
  children: ReactNode;
  backgroundColor?: BackgroundColor;
  className?: string;
}

const Callout = ({ children, backgroundColor = 'grey', className }: Props) => {
  return (
    <section
      className={customTwMerge(
        'bottom-12 my-4 px-8 py-4 text-16',
        backgroundColor && BACKGROUND_COLOR_MAP[backgroundColor],
        className,
      )}
    >
      {children}
    </section>
  );
};

export default Callout;
