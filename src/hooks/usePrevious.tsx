'use client';

import { useEffect, useRef } from 'react';

const INITIAL_VALUE = Symbol('initialValue');

export const isFirst = <T,>(
  value: T | typeof INITIAL_VALUE,
): value is typeof INITIAL_VALUE => value === INITIAL_VALUE;

export const hasPrevious = <T,>(value: T | typeof INITIAL_VALUE): value is T =>
  value !== INITIAL_VALUE;

const usePrevious = <T,>(value: T): T | typeof INITIAL_VALUE => {
  const ref = useRef<T | typeof INITIAL_VALUE>(INITIAL_VALUE);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
