'use client';

import dayjs from 'dayjs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const replacer = (key: string, value: unknown) => {
  if (value instanceof Date || dayjs.isDayjs(value)) {
    const date = dayjs(value);

    if (date.startOf('day').isSame(date)) {
      return date.format('YYYY-MM-DD');
    }

    return date.format('YYYY-MM-DD HH:mm:ss');
  }
  return value;
};

export default replacer;
