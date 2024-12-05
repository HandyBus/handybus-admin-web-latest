import { z } from 'zod';
import dayjs, { type Dayjs } from 'dayjs';

export const zodDay = z.custom<Dayjs>(
  (val) => val instanceof dayjs,
  'Invalid date',
);
