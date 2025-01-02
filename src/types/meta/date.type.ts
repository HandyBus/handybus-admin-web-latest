import { z } from 'zod';

export const invalidableDate = z.literal('Invalid Date').or(z.coerce.date());
export const nullableDate = z.null().or(z.coerce.date());
