import { z } from 'zod';

export const phoneRegex = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;

export const ActiveStatusEnum = z.enum(['ACTIVE', 'INACTIVE']);
export type ActiveStatus = z.infer<typeof ActiveStatusEnum>;
