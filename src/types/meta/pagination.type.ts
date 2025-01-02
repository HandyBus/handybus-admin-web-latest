import { z } from 'zod';

export const PaginationResponseSchema = <
  T extends z.ZodTypeAny,
  K extends string,
>(
  valueSchema: T,
  key: K,
): z.ZodObject<
  { [P in K]: T } & {
    totalCount: z.ZodNumber;
    nextPage: z.ZodNullable<z.ZodNumber>;
  }
> =>
  z.object({
    [key]: valueSchema,
    totalCount: z.number(),
    nextPage: z.number().nullable(),
  }) as z.ZodObject<
    {
      [P in K]: T;
    } & {
      totalCount: z.ZodNumber;
      nextPage: z.ZodNullable<z.ZodNumber>;
    }
  >;
