/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAccessToken } from './auth';
import { CustomError } from './custom-error';
import { logout } from '@/app/actions/logout.action';
import replacer from './replacer';
import { z } from 'zod';
import { silentParse } from '@/utils/parse.util';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const emptyShape = {};
type EmptyShape = typeof emptyShape;

interface RequestInitWithSchema<O extends z.ZodRawShape> extends RequestInit {
  shape?: O;
}

const ApiResponseOkSchema = <T extends z.ZodRawShape>(rawShape: T) =>
  z
    .object({ ok: z.literal(true), statusCode: z.number() })
    .merge(z.object(rawShape))
    .strict();

class Instance {
  constructor(private readonly baseUrl: string = BASE_URL ?? '') {}

  async fetchWithConfig<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    method: HttpMethod,
    body?: any,
    options: RequestInitWithSchema<T> = {},
  ) {
    const { shape, ...pure } = options;

    const config: RequestInit = {
      method,
      cache: 'no-store',
      ...pure,
      headers: {
        'Content-Type': 'application/json',
        ...pure?.headers,
      },
      ...(body && { body: JSON.stringify(body, replacer) }),
    };

    const schema = shape
      ? ApiResponseOkSchema(shape)
      : // NOTE this `as T` is safe because `shape` is undefined
        ApiResponseOkSchema(emptyShape as T);

    const res = await fetch(new URL(url, this.baseUrl).toString(), config);

    // response가 없는 경우
    if (res.statusText === 'No Content') {
      if (res.status >= 400) {
        throw new CustomError(res.status, 'No Content');
      }
      return silentParse(schema, {
        ok: true,
        statusCode: res.status,
      });
    }
    // response가 있는 경우
    const data = await res.json();
    if (!data.ok) {
      throw new CustomError(
        data.statusCode,
        data.error?.message || '알 수 없는 오류',
      );
    }

    return silentParse(
      schema,
      data,
      `${url}에 대한 응답이 실패했습니다. : ${data}`,
    );
  }

  async get<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.fetchWithConfig<T>(url, 'GET', undefined, options);
  }
  async delete<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    options?: RequestInitWithSchema<T>,
  ) {
    return await this.fetchWithConfig<T>(url, 'DELETE', undefined, options);
  }
  async post<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return await this.fetchWithConfig<T>(url, 'POST', body, options);
  }
  async put<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return await this.fetchWithConfig<T>(url, 'PUT', body, options);
  }
  async patch<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return await this.fetchWithConfig<T>(url, 'PATCH', body, options);
  }
}

export const instance = new Instance();

class AuthInstance {
  async authFetchWithConfig<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    method: HttpMethod,
    body?: unknown,
    options: RequestInitWithSchema<T> = {},
  ) {
    const accessToken = await getAccessToken();
    const authOptions: RequestInitWithSchema<T> = {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    };

    try {
      return await instance.fetchWithConfig<T>(url, method, body, authOptions);
    } catch (e) {
      const error = e as CustomError;
      const isServer = typeof window === 'undefined';
      if (error.statusCode === 401 && !isServer) {
        console.error('로그인 시간 만료: ', error.message);
        logout();
      }
      throw error;
    }
  }

  async get<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.authFetchWithConfig<T>(url, 'GET', undefined, options);
  }
  async delete<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.authFetchWithConfig<T>(url, 'DELETE', undefined, options);
  }

  async post<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.authFetchWithConfig<T>(url, 'POST', body, options);
  }
  async put<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.authFetchWithConfig<T>(url, 'PUT', body, options);
  }

  async patch<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.authFetchWithConfig<T>(url, 'PATCH', body, options);
  }
}

export const authInstance = new AuthInstance();

//////////////// utility for shape option ////////////////

type PaginatedResponse<Shape extends z.ZodRawShape> = Shape & {
  totalCount: z.ZodNumber;
  nextPage: z.ZodNullable<z.ZodNumber>;
};

export const withPagination = <Shape extends z.ZodRawShape>(
  shape: Shape,
): PaginatedResponse<Shape> =>
  ({
    ...shape,
    totalCount: z.number(),
    nextPage: z.number().nullable(),
  }) satisfies PaginatedResponse<Shape>;
