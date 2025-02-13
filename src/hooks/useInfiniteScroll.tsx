'use client';

import { useEffect, useRef } from 'react';

import type {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';

interface Props {
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<unknown, unknown>>;
  isLoading?: boolean;
  hasNextPage?: boolean;
  className?: string;
}

const useInfiniteScroll = ({
  fetchNextPage,
  isLoading,
  hasNextPage,
  className,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const useObserver = ({
    target,
    rootMargin = '0px',
    threshold = 1.0,
    onIntersect,
  }: {
    target: React.RefObject<HTMLElement>;
    rootMargin?: string;
    threshold?: number;
    onIntersect: IntersectionObserverCallback;
  }) => {
    useEffect(() => {
      let observer: IntersectionObserver | undefined;

      if (target && target.current) {
        observer = new IntersectionObserver(onIntersect, {
          root: null,
          rootMargin,
          threshold,
        });

        observer.observe(target.current);
      }
      return () => observer && observer.disconnect();
    }, [target, rootMargin, threshold, onIntersect]);
  };

  const onIntersect = ([entry]: IntersectionObserverEntry[]) =>
    entry.isIntersecting && fetchNextPage();

  useObserver({
    target: ref,
    onIntersect,
  });

  const InfiniteScrollTrigger = () => {
    return (
      <div
        ref={ref}
        className={`${isLoading || !hasNextPage ? 'hidden' : ''} ${className}`}
      />
    );
  };

  return { InfiniteScrollTrigger };
};

export default useInfiniteScroll;
