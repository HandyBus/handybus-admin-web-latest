'use client';

import { useEffect, useRef } from 'react';

const INITIAL_VALUE = Symbol('initialValue');

const usePrevious = <T,>(
  value: T,
):
  | { isFirst: true; hasPrevious: false; current: unknown }
  | {
      isFirst: false;
      hasPrevious: true;
      current: T;
    } => {
  const ref = useRef<T | typeof INITIAL_VALUE>(INITIAL_VALUE);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current === INITIAL_VALUE
    ? { isFirst: true, hasPrevious: false, current: null }
    : { isFirst: false, hasPrevious: true, current: ref.current };
};

export default usePrevious;
