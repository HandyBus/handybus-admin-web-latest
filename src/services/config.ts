/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAccessToken } from './auth';
//   setAccessToken,
//   setRefreshToken,
//   updateToken,
// } from '@/utils/handleToken';
import { CustomError } from './custom-error';
import { logout } from '@/app/actions/logout.action';
import replacer from './replacer';
import { z } from 'zod';
import { silentParse } from '@/utils/parse.util';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EmptyShape = {};
type EmptyShape = typeof EmptyShape;

interface RequestInitWithSchema<T extends z.ZodRawShape> extends RequestInit {
  shape?: T;
}

const ApiResponseOkSchema = <T extends z.ZodRawShape>(
  rawShape: T,
): z.ZodObject<{ ok: z.ZodLiteral<true>; statusCode: z.ZodNumber } & T> =>
  z
    .object(rawShape)
    .merge(z.object({ ok: z.literal(true), statusCode: z.number() }));

// const ApiResponseSchema = <T extends z.ZodRawShape>(
//   rawShape: T,
// ): z.ZodDiscriminatedUnion<
//   'ok',
//   [
//     z.ZodObject<
//       T & {
//         ok: z.ZodLiteral<true>;
//         statusCode: z.ZodNumber;
//       }
//     >,
//     z.ZodObject<{
//       ok: z.ZodLiteral<false>;
//       statusCode: z.ZodNumber;
//       error: z.ZodObject<{
//         message: z.ZodString;
//         stack: z.ZodArray<z.ZodString>;
//       }>;
//     }>,
//   ]
// > =>
//   z.discriminatedUnion('ok', [
//     z.object({ ok: z.literal(true), statusCode: z.number(), ...rawShape }),
//     z.object({
//       ok: z.literal(false),
//       statusCode: z.number(),
//       error: z.object({
//         message: z.string(),
//         stack: z.string().array(),
//       }),
//     }),
//   ]);

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
      : // NOTE 이 부분은 유일하게
        ApiResponseOkSchema(EmptyShape as T);

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

    return silentParse(schema, data);
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
