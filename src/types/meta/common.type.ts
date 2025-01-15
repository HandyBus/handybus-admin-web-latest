import { z } from 'zod';

/** @deprecated not use coerce */
export const nullableDate = z.null().or(z.coerce.date());
export const phoneRegex = /^01\d\-\d{4}\-d{4}$/;
