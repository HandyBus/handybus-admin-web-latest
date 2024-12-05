import { useCallback, useRef } from 'react';

const useDebounce = <Args extends unknown[], R>(
  callback: (...args: Args) => R,
  delay: number,
): ((...args: Args) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
};

export default useDebounce;
