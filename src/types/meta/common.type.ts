import { z } from 'zod';

/** @deprecated not use coerce */
export const nullableDate = z.null().or(z.coerce.date());
export const phoneRegex = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
