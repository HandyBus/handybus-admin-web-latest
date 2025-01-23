import { ReactNode } from 'react';
import { BackgroundColor, BACKGROUND_COLOR_MAP } from './color.const';
import { twMerge } from 'tailwind-merge';

interface Props {
  children: ReactNode;
  backgroundColor?: BackgroundColor;
}

const Callout = ({ children, backgroundColor = 'grey' }: Props) => {
  return (
    <section
      className={twMerge(
        'bottom-12 my-4 px-8 py-4 text-16',
        backgroundColor && BACKGROUND_COLOR_MAP[backgroundColor],
      )}
    >
      {children}
    </section>
  );
};

export default Callout;
