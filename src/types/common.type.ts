import { z } from 'zod';

export const phoneRegex = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;

export const ActiveStatusEnum = z.enum(['ACTIVE', 'INACTIVE']);
export type ActiveStatus = z.infer<typeof ActiveStatusEnum>;

type PaginatedResponse<Shape extends z.ZodRawShape> = Shape & {
  totalCount: z.ZodNumber;
  nextPage: z.ZodNullable<z.ZodString>;
};

// limit이 없을 경우 전체 데이터 조회
export const withPagination = <Shape extends z.ZodRawShape>(
  shape: Shape,
): PaginatedResponse<Shape> =>
  ({
    ...shape,
    totalCount: z.number(),
    nextPage: z.string().nullable(),
  }) satisfies PaginatedResponse<Shape>;

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}${'' extends P ? '' : ','}${P}`
    : never
  : never;

export type Combinations<
  T extends string,
  U extends string = T,
> = T extends string ? T | Join<T, Combinations<Exclude<U, T>>> : never;
