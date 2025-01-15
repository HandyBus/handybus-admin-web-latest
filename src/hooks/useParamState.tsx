'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export interface ParamStateOptions<State> {
  encoder: (state: State) => string | null;
  decoder: (encoded: string | null) => State;
}

/**
 * useQueryState is a hook that returns a stateful value, and a function to update it.
 * It also updates the URL query string with the encoded state.
 *
 * @param initialState initial state of the query
 * @param encoder function to encode the state to a url query string
 * @param decoder function to decode the url query string to the state
 * @returns [state, setState] where state is the current state and setState is a function to update the state
 */
const useParamState = <S,>(
  defaultState: S | (() => S),
  queryKey: string,
  options: ParamStateOptions<S>,
): [S, Dispatch<SetStateAction<S>>] => {
  const { encoder, decoder } = options;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [state, setState] = useState(
    searchParams.get(queryKey) !== null
      ? decoder(String(searchParams.get(queryKey)))
      : defaultState,
  );

  const prevState = useRef(state);
  const prevSp = useRef(searchParams.toString());

  useEffect(() => {
    if (state !== prevState.current) {
      prevState.current = state;

      const sp = new URLSearchParams();
      for (const [key, value] of searchParams) {
        if (key !== queryKey) {
          sp.append(key, value);
        }
      }
      const encoded = encoder(state);

      if (encoded !== null) sp.append(queryKey, encoded);

      router.replace(`${pathname}?${sp.toString()}`);
    }
  }, [state, router, queryKey, pathname, encoder, searchParams]);

  useEffect(() => {
    if (searchParams.toString() !== prevSp.current) {
      prevSp.current = searchParams.toString();

      const got = searchParams.get(queryKey);

      const newState = decoder(got);
      setState((current) => {
        prevState.current = current;
        return newState;
      });
    }
  }, [searchParams, decoder, queryKey, defaultState]);

  return [state, setState];
};

export default useParamState;

//////////////////////////// extensions ////////////////////////////

export const optionalNumberOpt = Object.freeze({
  encoder: (n: number | undefined) => (n === undefined ? null : n.toString()),
  decoder: (s: string | null) => {
    if (s === null || s === '') return undefined;
    const n = Number(s);
    return Number.isNaN(n) ? undefined : n;
  },
});

export const optionalStringOpt = Object.freeze({
  encoder: (s: string | undefined) => (s === '' ? null : (s ?? null)),
  decoder: (s: string | null) => s ?? undefined,
});
